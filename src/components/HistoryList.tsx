import React from 'react';
import { Intention } from '../types';

interface Props {
  history: Intention[];
}

export const HistoryList: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  const getStatusDisplay = (status: Intention['status']) => {
    switch (status) {
      case 'completed':
        return { symbol: '✓', label: 'Completed', symbolColor: 'text-neutral-900', textColor: 'text-neutral-700', badgeColor: 'text-neutral-400' };
      case 'pending':
        return { symbol: '→', label: 'Pending', symbolColor: 'text-neutral-400', textColor: 'text-neutral-700', badgeColor: 'text-neutral-400' };
      case 'cancelled':
        return { symbol: '×', label: 'Cancelled', symbolColor: 'text-neutral-300', textColor: 'text-neutral-400', badgeColor: 'text-neutral-300' };
      default:
        return { symbol: '•', label: 'Active', symbolColor: 'text-neutral-600', textColor: 'text-neutral-700', badgeColor: 'text-neutral-400' };
    }
  };

  return (
    <div id="history-section" className="flex flex-col gap-3 pt-6 border-t border-neutral-100">
      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
        History
      </h3>
      <div id="history-items-container" className="flex flex-col gap-2.5">
        {history.map((item) => {
          const { symbol, label, symbolColor, textColor, badgeColor } = getStatusDisplay(item.status);
          return (
            <div
              id={`history-item-${item.id}`}
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100"
            >
              <div className="flex items-center gap-3 max-w-[70%]">
                <span className={`font-bold text-sm ${symbolColor}`}>{symbol}</span>
                <span className={`text-xs font-medium break-words ${textColor}`}>
                  {item.text}
                </span>
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${badgeColor}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
