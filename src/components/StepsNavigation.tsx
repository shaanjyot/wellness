'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StepsNavigationProps {
  currentStep?: string;
}

export default function StepsNavigation({ currentStep }: StepsNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    { id: 'choose', label: 'Choose IV Drip', completed: true },
    { id: 'schedule', label: 'Schedule Appointment', completed: currentStep === 'schedule' || currentStep === 'consultation' || currentStep === 'drip' },
    { id: 'consultation', label: 'In-person Consultation', completed: currentStep === 'consultation' || currentStep === 'drip' },
    { id: 'drip', label: 'Time to Drip', completed: currentStep === 'drip' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg hover:from-teal-600 hover:to-amber-600 transition-all duration-200"
      >
        <span className="text-sm font-medium">Steps</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center px-4 py-2 ${
                step.completed ? 'text-teal-600' : 'text-gray-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                step.completed
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
