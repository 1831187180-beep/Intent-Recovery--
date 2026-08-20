import React from 'react';
import { ExperimentCondition } from '../types';

interface Props {
  currentCondition: ExperimentCondition;
  onConditionChange: (condition: ExperimentCondition) => void;
}

export const ExperimentBar: React.FC<Props> = ({ currentCondition, onConditionChange }) => {
  return (
    <div id="experiment-controller-bar" className="p-4 bg-neutral-900 rounded-2xl text-white shadow-md">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Experiment Group
        </span>
        <span className="text-[10px] font-bold bg-white text-neutral-900 px-2 py-0.5 rounded">
          Condition {currentCondition}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-neutral-800 p-1 rounded-xl">
        <button
          id="condition-btn-a"
          type="button"
          onClick={() => onConditionChange('A')}
          className={`py-1.5 rounded-lg text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
            currentCondition === 'A'
              ? 'bg-neutral-700 text-white shadow-inner'
              : 'text-neutral-400 opacity-50 hover:opacity-100 hover:text-white'
          }`}
        >
          Group A
        </button>
        <button
          id="condition-btn-b"
          type="button"
          onClick={() => onConditionChange('B')}
          className={`py-1.5 rounded-lg text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
            currentCondition === 'B'
              ? 'bg-neutral-700 text-white shadow-inner'
              : 'text-neutral-400 opacity-50 hover:opacity-100 hover:text-white'
          }`}
        >
          Group B
        </button>
        <button
          id="condition-btn-c"
          type="button"
          onClick={() => onConditionChange('C')}
          className={`py-1.5 rounded-lg text-center text-[10px] font-bold uppercase transition-all cursor-pointer ${
            currentCondition === 'C'
              ? 'bg-neutral-700 text-white shadow-inner'
              : 'text-neutral-400 opacity-50 hover:opacity-100 hover:text-white'
          }`}
        >
          Group C
        </button>
      </div>
    </div>
  );
};
