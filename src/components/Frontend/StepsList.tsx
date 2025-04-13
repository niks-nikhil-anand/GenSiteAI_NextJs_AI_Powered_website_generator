import React from 'react';
import { FaCheckCircle, FaRegCircle, FaTools } from 'react-icons/fa';
import { BsClock, BsArrowClockwise } from 'react-icons/bs';
import { Step } from '../../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="rounded-lg shadow-lg bg-white p-6 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-5 text-black flex items-center gap-4">
        <FaTools className="text-blue-600" />
        Build Tools 
      </h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={`step-${step.id}-${index}`}
            className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
              currentStep === step.id
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-3">
              {step.status === 'completed' ? (
                <FaCheckCircle className="w-6 h-6 text-green-500" />
              ) : step.status === 'in-progress' ? (
                <div className="relative w-6 h-6">
                  <BsArrowClockwise className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : (
                <FaRegCircle className="w-6 h-6 text-gray-400" />
              )}
              <h3 className="font-semibold text-black">{step.title}</h3>
              {step.status === 'in-progress' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">In progress</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2 pl-9">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}