"use client";
import { useUserStore } from '@/app/store/useUserStore';
import { StepsList } from '@/components/Frontend/StepsList';
import CodeView from '@/components/User/CodeView';
import { parseXml } from '@/utils/parseXmlSteps';
import React, { useEffect, useState } from 'react';
import { Step, StepType } from '../../../types';
import { FileExplorer } from '@/components/Frontend/FileExplorer';
import Loading from '@/components/Loader/loading';
import axios from 'axios'; // Ensure axios is imported
import { CodeEditor } from '@/components/Frontend/CodeEditors';
import { TabView } from '@/components/Frontend/TabView';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [templateSet, setTemplateSet] = useState<boolean>(false);
  const [userPrompt, setPrompt] = useState<string>('');
  const [llmMessages, setLlmMessages] = useState<{ role: string; content: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code'); // Add activeTab state

  // Fetch data from the template API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching data

        const response = await fetch("/api/template", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
          console.error("Template API failed");
          setLoading(false); // Ensure loading is reset on error
          return;
        }

        const data = await response.json();
        const { prompts, uiPrompts } = data;

        // Parse UI prompts and set steps
        const parsedSteps = parseXml(uiPrompts[0]).map((x: Step) => ({
          ...x,
          status: "pending" as const, // Ensure status is a literal type
        }));
        setSteps(parsedSteps);

        // Fetch code generation steps
        const stepsResponse = await fetch("/api/codeGen", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ prompts }),
        });

        if (!stepsResponse.ok) {
          console.error("CodeGen API failed");
          setLoading(false); // Ensure loading is reset on error
          return;
        }

        const stepsData = await stepsResponse.json();
        console.log(stepsData); // Log the response for debugging

        // Parse the response into additional steps
        const additionalSteps = parseXml(stepsData.response).map((x: Step) => ({
          ...x,
          status: "pending" as const, // Ensure status is a literal type
        }));

        // Merge additional steps with the existing steps
        setSteps((prevSteps) => [...prevSteps, ...additionalSteps]);

        // Update LLM messages
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

        setTemplateSet(true); // Mark template as set
        setLoading(false); // Reset loading state
      } catch (error) {
        console.error("Error in template API", error);
        setLoading(false); // Ensure loading is reset on error
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
        return { ...step, status: "completed" as const }; // Mark step as completed
      }
      return step;
    });

    if (updateHappened) {
      setFiles(originalFiles); // Update the file structure
      setSteps(updatedSteps); // Update the steps
    }
  }, [steps, files]);

  // Handle sending user prompts
  const handleSendPrompt = async () => {
    const newMessage = {
      role: "user",
      content: userPrompt,
    };

    setLoading(true);
    try {
      const stepsResponse = await axios.post("/api/codeGen", {
        messages: [...llmMessages, newMessage],
      });

      setLlmMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
        {
          role: "assistant",
          content: stepsResponse.data.response,
        },
      ]);

      setSteps((prevSteps) => [
        ...prevSteps,
        ...parseXml(stepsResponse.data.response).map((x: Step) => ({
          ...x,
          status: "pending" as const, // Ensure status is a literal type
        })),
      ]);
    } catch (error) {
      console.error("Error sending prompt", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
  {/* Grid layout for StepsList, FileExplorer, and CodeEditor */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* StepsList - 25% width */}
    <div className="col-span-1 max-h-[55vh] overflow-y-scroll border border-gray-200 rounded-lg shadow-sm p-4">
      <StepsList steps={steps} currentStep={currentStep ?? 0} onStepClick={setCurrentStep} />
    </div>

    {/* FileExplorer - 25% width with fixed height and scrollbar */}
    <div className="col-span-1 h-[55vh] overflow-y-scroll border border-gray-200 rounded-lg shadow-sm p-4">
      <FileExplorer
        files={files}
        onFileSelect={setSelectedFile}
      />
    </div>

    {/* CodeEditor - 50% width with fixed height and scrollbar */}
    <div className="col-span-2 h-[55vh] bg-gray-900 rounded-lg shadow-lg p-4 overflow-y-scroll">
      <TabView activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="h-[calc(100%-4rem)] mt-4">
        {activeTab === 'code' ? (
          <CodeEditor file={selectedFile} />
        ) : (
          <CodeView />
        )}
      </div>
    </div>
  </div>

  {/* Input Field - Below StepsList and FileExplorer */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
    {/* Empty space to align with StepsList */}
    <div className="col-span-1"></div>

    {/* Input Field - 50% width (spanning 2 columns) */}
    <div className="col-span-2">
      <div className="flex flex-col gap-4">
        {(loading || !templateSet) && <Loading />}
        {!(loading || !templateSet) && (
          <div className="flex flex-col gap-2">
            <textarea
              value={userPrompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="p-2 w-full border border-gray-300 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              placeholder="Enter your prompt..."
            />
            <button
              onClick={handleSendPrompt}
              className="bg-purple-400 px-4 py-2 rounded-lg text-white hover:bg-purple-500 transition-colors duration-200"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Empty space to align with CodeEditor */}
    <div className="col-span-1"></div>
  </div>
</div>
  );
};

export default Workplace;