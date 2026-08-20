import React, { useState } from 'react';

interface Props {
  onCapture: (text: string) => void;
}

export const IntentionCapture: React.FC<Props> = ({ onCapture }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onCapture(text.trim());
    setText('');
  };

  return (
    <form id="intention-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="intention-input"
          className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase"
        >
          Capture Intention · 记录当下意图
        </label>
        <input
          id="intention-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例如：搜索美食推荐、回复邮件"
          autoFocus
          className="w-full text-base font-medium px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-all shadow-xs placeholder:text-neutral-400"
          aria-label="输入你接下来想要完成的事情"
        />
      </div>

      <button
        id="intention-submit-btn"
        type="submit"
        disabled={!text.trim()}
        className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-neutral-300/40 active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
      >
        记录意图
      </button>
    </form>
  );
};
