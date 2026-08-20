export type IntentionStatus = 'active' | 'completed' | 'pending' | 'cancelled';

export interface Intention {
  id: string;
  text: string;
  createdAt: number;
  reminderAt: number;
  status: IntentionStatus;
  reminderCount: number;
  completedAt?: number;
}

export type ExperimentCondition = 'A' | 'B' | 'C';

export interface ExperimentConfig {
  condition: ExperimentCondition;
  defaultTimerSeconds: number; // 默认 60 秒
  snoozeTimerSeconds: number;  // 默认 300 秒 (5分钟)
}
