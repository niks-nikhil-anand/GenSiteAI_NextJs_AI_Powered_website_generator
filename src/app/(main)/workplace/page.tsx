"use client"
import { useUserStore } from '@/app/store/useUserStore';
import { StepsList } from '@/components/Frontend/StepsList';
import CodeView from '@/components/User/CodeView';
import { parseXml } from '@/utils/parseXmlSteps';
import React, { useEffect, useState } from 'react';
import { Step, StepType } from '../../../types'; 

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
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileStructure[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/template", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ userInput }),
        });
       
        if (!response.ok) {
          console.error("Template API failed");
          return;
        }

        const data = await response.json(); // Parse the response as JSON
        const { prompts, uiPrompts } = data;

        setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
          ...x,
          status: "pending"
        })));
      } catch (error) {
        console.error("Error in template API", error);
      }
    };
    fetchData();
  }, [userInput]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
  
    const updatedSteps: Step[] = steps.map((step) => {
      if (step.status === "pending") {
        updateHappened = true;
        if (step.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;
          let currentFolder = "";
  
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);
  
            if (!parsedPath.length) {
              let file = currentFileStructure.find((x) => x.path === currentFolder);
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
              let folder = currentFileStructure.find((x) => x.path === currentFolder);
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }
  
              currentFileStructure = currentFileStructure.find((x) => x.path === currentFolder)!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
        return { ...step, status: "completed" }; // Ensure this matches the `Step` type
      }
      return step; // Ensure this matches the `Step` type
    });
  
    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(updatedSteps); // This should now be a valid `Step[]`
    }
  }, [steps, files]);

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="max-h-[75vh] overflow-scroll">
          <StepsList steps={steps} currentStep={currentStep ?? 0} onStepClick={setCurrentStep} />
        </div>
        <div className="md:col-span-2">
          
        </div>
      </div>
    </div>
  );
};

export default Workplace;