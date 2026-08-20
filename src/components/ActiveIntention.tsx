import React, { useEffect, useState } from 'react';
import { Intention } from '../types';

interface Props {
  intention: Intention;
  onCancel: () => void;
  onEdit: () => void;
}

export const ActiveIntention: React.FC<Props> = ({ intention, onCancel, onEdit }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const remaining = Math.max(0, Math.ceil((intention.reminderAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [intention.reminderAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="active-intention-card" className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
          Active Intention
        </span>
        <h2 id="active-intention-text" className="text-xl sm:text-2xl font-bold text-neutral-900 break-words leading-tight">
          {intention.text}
        </h2>
      </div>

      <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between border border-neutral-100">
        <span className="text-neutral-500 text-xs font-medium">提醒将在后出现</span>
        <span id="active-timer-display" className="font-mono text-lg font-bold text-neutral-900 tabular-nums">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          id="edit-intention-btn"
          onClick={onEdit}
          type="button"
          className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
        >
          编辑
        </button>
        <button
          id="cancel-intention-btn"
          onClick={onCancel}
          type="button"
          className="flex-1 py-2.5 px-4 bg-white border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 text-neutral-500 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
        >
          取消
        </button>
      </div>
    </div>
  );
};
