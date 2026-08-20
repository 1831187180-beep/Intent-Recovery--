import { ExperimentConfig, ExperimentCondition } from './types';

export const DEFAULT_CONFIG: ExperimentConfig = {
  condition: 'C', // 默认为 Intent Recovery 条件
  defaultTimerSeconds: 60, // 1 分钟 MVP 测试
  snoozeTimerSeconds: 300, // 5 分钟
};

/**
 * 根据 HCI 实验组生成提醒文案
 */
export function getReminderCopy(condition: ExperimentCondition, intentionText: string): { title: string; body: string } {
  switch (condition) {
    case 'A':
      return {
        title: 'Intent Recovery',
        body: '', // Condition A 无提醒
      };
    case 'B':
      return {
        title: '任务提醒',
        body: `记得：${intentionText}`,
      };
    case 'C':
    default:
      return {
        title: 'Intent Recovery',
        body: `刚刚想要做「${intentionText}」，完成了吗？`,
      };
  }
}
