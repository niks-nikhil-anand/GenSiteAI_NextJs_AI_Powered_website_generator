import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../../types';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  // Ensure file.content is always a string
  const content = file.content || '';

  // Dynamically set the language based on the file extension
  const getLanguageFromExtension = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  const language = getLanguageFromExtension(file.name);

  return (
    <Editor
      key={file.name} // Ensure the editor re-renders when the file changes
      height="100%"
      language={language} // Dynamically set the language
      theme="vs-dark"
      value={content}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
      aria-label={`Code editor for ${file.name}`} // Improve accessibility
    />
  );
}