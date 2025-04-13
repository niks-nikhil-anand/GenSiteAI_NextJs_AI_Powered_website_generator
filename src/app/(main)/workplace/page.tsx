"use client";
import { useUserStore } from "@/app/store/useUserStore";
import { StepsList } from "@/components/Frontend/StepsList";
import CodeView from "@/components/User/CodeView";
import { parseXml } from "@/utils/parseXmlSteps";
import React, { useEffect, useState } from "react";
import { Step, StepType } from "../../../types";
import { FileExplorer } from "@/components/Frontend/FileExplorer";
import Loading from "@/components/Loader/loading";
import axios from "axios"; // Ensure axios is imported
import { CodeEditor } from "@/components/Frontend/CodeEditors";
import { TabView } from "@/components/Frontend/TabView";

interface FileStructure {
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  children?: FileStructure[];
}

const Workplace = () => {
  const { userInput } = useUserStore();

  // Define state variables
  const [  steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileStructure[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [templateSet, setTemplateSet] = useState<boolean>(false);
  const [userPrompts, setUserPrompts] = useState({ prompts: [], uiPrompts: [] });
  const [llmMessages, setLlmMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code"); // Add activeTab state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const response = await fetch("/api/template", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ userInput }),
        });
  
        if (!response.ok) {
          console.error("Template API failed");
          setLoading(false);
          return;
        }
  
        const data = await response.json();
        const { prompts, uiPrompts } = data;
        console.log(prompts);
        console.log(uiPrompts);
  
        // Save prompts + uiPrompts in a separate state
        setUserPrompts({ prompts, uiPrompts });
  
        // Parse the first UI prompt
        const parsedSteps = parseXml(uiPrompts[0]).map((x: Step) => ({
          ...x,
          status: "pending" as const,
        }));
        setSteps(parsedSteps);
  
        // Call the codeGen API with userPrompts
        const stepsResponse = await fetch("/api/codeGen", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ prompts, uiPrompts }),
        });
  
        if (!stepsResponse.ok) {
          console.error("CodeGen API failed");
          setLoading(false);
          return;
        }
  
        const stepsData = await stepsResponse.json();
        console.log(stepsData);
  
        const additionalSteps = parseXml(stepsData.response).map((x: Step) => ({
          ...x,
          status: "pending" as const,
        }));
  
        setSteps((prevSteps) => [...prevSteps, ...additionalSteps]);
  
        setLlmMessages([
          ...prompts.map((content: any) => ({
            role: "user",
            content,
          })),
          {
            role: "assistant",
            content: stepsData.response,
          },
        ]);
  
        setTemplateSet(true);
        setLoading(false);
      } catch (error) {
        console.error("Error in template API", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userInput]);

  // Update files based on steps
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    const updatedSteps: Step[] = steps.map((step) => {
      if (step.status === "pending") {
        updateHappened = true;
        if (step.type === StepType.CreateFile && step.path) {
          let parsedPath = step.path.split("/");
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;
          let currentFolder = "";

          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
        return { ...step, status: "completed" as const }; // Mark step as completed
      }
      return step;
    });

    if (updateHappened) {
      setFiles(originalFiles); // Update the file structure
      setSteps(updatedSteps); // Update the steps
    }
  }, [steps, files]);

  return (
    <div className="p-6">
      {/* Grid layout for StepsList, FileExplorer, and CodeEditor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* StepsList - 25% width */}
        <div className="col-span-1 max-h-[55vh] overflow-y-scroll border border-gray-200 rounded-lg shadow-sm p-4">
          <StepsList
            steps={steps}
            currentStep={currentStep ?? 0}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* FileExplorer - 25% width with fixed height and scrollbar */}
        <div className="col-span-1 h-[55vh] overflow-y-scroll border border-gray-200 rounded-lg shadow-sm p-4">
          <FileExplorer files={files} onFileSelect={setSelectedFile} />
        </div>

        {/* CodeEditor - 50% width with fixed height and scrollbar */}
        <div className="col-span-2 h-[55vh] bg-gray-900 rounded-lg shadow-lg p-4 overflow-y-scroll">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="h-[calc(100%-4rem)] mt-4">
            {activeTab === "code" ? (
              <CodeEditor file={selectedFile} />
            ) : (
              <CodeView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workplace;
