import React, { useState, useEffect } from 'react';
import { Intention, ExperimentCondition } from './types';
import { DEFAULT_CONFIG, getReminderCopy } from './config';
import { storage } from './utils/storage';
import { requestNotificationPermission, sendWebNotification } from './utils/notification';
import { oneSignalManager } from './utils/oneSignalManager';
import { IntentionCapture } from './components/IntentionCapture';
import { ActiveIntention } from './components/ActiveIntention';
import { NotificationOverlay } from './components/NotificationOverlay';
import { HistoryList } from './components/HistoryList';
import { ExperimentBar } from './components/ExperimentBar';

export const App: React.FC = () => {
  const [condition, setCondition] = useState<ExperimentCondition>(() =>
    storage.getCondition(DEFAULT_CONFIG.condition)
  );
  const [activeIntention, setActiveIntention] = useState<Intention | null>(() =>
    storage.getActiveIntention()
  );
  const [history, setHistory] = useState<Intention[]>(() => storage.getHistory());
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // 同步本地存储
  useEffect(() => {
    storage.setActiveIntention(activeIntention);
  }, [activeIntention]);

  useEffect(() => {
    storage.setCondition(condition);
  }, [condition]);

  // 初始化 OneSignal Web SDK
  useEffect(() => {
    oneSignalManager.initialize().catch((err) => {
      console.warn('[OneSignal] Auto-init skipped:', err);
    });
  }, []);

  // 提醒轮询定时器（基于绝对时间戳，刷新/切后台不丢进度）
  useEffect(() => {
    if (!activeIntention || activeIntention.status !== 'active') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= activeIntention.reminderAt) {
        // 条件 A 模式下不触发任何提醒
        if (condition !== 'A') {
          const { title, body } = getReminderCopy(condition, activeIntention.text);
          sendWebNotification(title, body);
          setShowNotificationModal(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeIntention, condition]);

  const handleCapture = async (text: string) => {
    await requestNotificationPermission();

    const newIntention: Intention = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text,
      createdAt: Date.now(),
      reminderAt: Date.now() + DEFAULT_CONFIG.defaultTimerSeconds * 1000,
      status: 'active',
      reminderCount: 0,
    };
    setActiveIntention(newIntention);
    oneSignalManager.trackIntention(text, condition);
  };


  const handleEdit = () => {
    if (!activeIntention) return;
    const newText = prompt('修改你的 intention:', activeIntention.text);
    if (newText && newText.trim()) {
      setActiveIntention({
        ...activeIntention,
        text: newText.trim(),
      });
    }
  };

  const handleCancelActive = () => {
    if (!activeIntention) return;
    const updated: Intention = {
      ...activeIntention,
      status: 'cancelled',
    };
    storage.addHistory(updated);
    setHistory(storage.getHistory());
    setActiveIntention(null);
    setShowNotificationModal(false);
  };

  const handleActionComplete = () => {
    if (!activeIntention) return;
    const updated: Intention = {
      ...activeIntention,
      status: 'completed',
      completedAt: Date.now(),
    };
    storage.addHistory(updated);
    setHistory(storage.getHistory());
    setActiveIntention(null);
    setShowNotificationModal(false);
  };

  const handleActionPending = () => {
    if (!activeIntention) return;
    const updated: Intention = {
      ...activeIntention,
      status: 'active', // 保持 active 继续倒计时
      reminderCount: activeIntention.reminderCount + 1,
      reminderAt: Date.now() + DEFAULT_CONFIG.snoozeTimerSeconds * 1000,
    };
    setActiveIntention(updated);
    setShowNotificationModal(false);
  };

  return (
    <main id="app-root" className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 sm:p-6 lg:p-10 font-sans">
      {/* Geometric Device Frame */}
      <div
        id="device-frame"
        className="w-full max-w-[412px] min-h-[100dvh] sm:min-h-[732px] sm:max-h-[840px] bg-white sm:rounded-[3rem] sm:border-[12px] sm:border-neutral-900 sm:shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Geometric Notch */}
        <div
          id="device-notch"
          className="hidden sm:block h-6 w-32 bg-neutral-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20 pointer-events-none"
        />

        {/* Inner Content Area */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 pt-8 sm:pt-12 overflow-y-auto justify-between gap-6">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <header id="main-header" className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                Intent Recovery
              </h1>
              <p className="text-sm font-medium text-neutral-500">
                External Intention Memory
              </p>
            </header>

            {/* Core Interactive Area */}
            <section id="core-interactive-area" aria-live="polite">
              {activeIntention ? (
                <ActiveIntention
                  intention={activeIntention}
                  onCancel={handleCancelActive}
                  onEdit={handleEdit}
                />
              ) : (
                <IntentionCapture onCapture={handleCapture} />
              )}
            </section>

            {/* History Log */}
            <HistoryList history={history} />
          </div>

          {/* Experiment Controller Bar */}
          <div className="mt-auto pt-4">
            <ExperimentBar
              currentCondition={condition}
              onConditionChange={setCondition}
            />
          </div>
        </div>

        {/* Mock Notification Overlay */}
        {showNotificationModal && activeIntention && (
          <NotificationOverlay
            intention={activeIntention}
            condition={condition}
            onComplete={handleActionComplete}
            onPending={handleActionPending}
            onCancel={handleCancelActive}
          />
        )}
      </div>

      {/* Desktop Prototype Status Meta */}
      <aside
        id="desktop-prototype-status"
        className="hidden lg:flex fixed bottom-8 right-8 flex-col items-end gap-1.5 text-neutral-500 pointer-events-none select-none"
      >
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">
            Prototype Status
          </p>
          <p className="text-xl font-light text-neutral-700">
            HCI Variable <span className="font-bold text-neutral-900">Active</span>
          </p>
        </div>
        <div className="h-px w-28 bg-neutral-300 my-1" />
        <div className="flex gap-3 text-[10px] font-mono text-neutral-400">
          <span>Ref: IR-042</span>
          <span>Condition: {condition}</span>
        </div>
      </aside>
    </main>
  );
};

export default App;
