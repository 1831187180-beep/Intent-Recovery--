import React from 'react';
import { Intention, ExperimentCondition } from '../types';
import { getReminderCopy } from '../config';

interface Props {
  intention: Intention;
  condition: ExperimentCondition;
  onComplete: () => void;
  onPending: () => void;
  onCancel: () => void;
}

export const NotificationOverlay: React.FC<Props> = ({
  intention,
  condition,
  onComplete,
  onPending,
  onCancel,
}) => {
  const { title, body } = getReminderCopy(condition, intention.text);

  return (
    <div
      id="notification-modal-backdrop"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
      aria-describedby="reminder-desc"
      className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <div
        id="notification-modal-card"
        className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col gap-6 border border-neutral-100"
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
            <span id="reminder-title" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {condition === 'C' ? 'Recovery Prompt' : title}
            </span>
          </div>
          <p id="reminder-desc" className="text-xl font-bold text-neutral-900 leading-tight tracking-tight">
            {body}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            id="reminder-btn-completed"
            type="button"
            onClick={onComplete}
            className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-neutral-200 active:scale-[0.99] transition-all cursor-pointer"
          >
            ✓ 我已经完成了
          </button>
          <button
            id="reminder-btn-pending"
            type="button"
            onClick={onPending}
            className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-2xl font-bold text-sm active:scale-[0.99] transition-all cursor-pointer"
          >
            → 还没，稍后再提醒
          </button>
          <button
            id="reminder-btn-cancel"
            type="button"
            onClick={onCancel}
            className="w-full py-3 bg-transparent hover:bg-neutral-50 text-neutral-400 rounded-xl font-bold text-[11px] uppercase tracking-wider mt-2 transition-all cursor-pointer"
          >
            不再需要这个提醒
          </button>
        </div>
      </div>
    </div>
  );
};
