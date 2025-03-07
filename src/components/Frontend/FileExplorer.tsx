import React, { useState } from 'react';
import { FaFolder, FaFile, FaChevronRight, FaChevronDown } from 'react-icons/fa'; // Using React Icons
import { FileItem } from '../../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-500">
            {isExpanded ? (
              <FaChevronDown className="w-4 h-4" />
            ) : (
              <FaChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          <FaFolder className="w-4 h-4 text-blue-500" />
        ) : (
          <FaFile className="w-4 h-4 text-gray-500" />
        )}
        <span className="text-gray-800">{item.name}</span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <FaFolder className="w-5 h-5 text-blue-500" />
        File Explorer
      </h2>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}