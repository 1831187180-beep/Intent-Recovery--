import { Intention, ExperimentCondition } from '../types';

const STORAGE_KEYS = {
  ACTIVE_INTENTION: 'ir_active_intention',
  INTENTION_HISTORY: 'ir_history',
  CONDITION: 'ir_experiment_condition',
};

export const storage = {
  getActiveIntention: (): Intention | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_INTENTION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setActiveIntention: (intention: Intention | null): void => {
    try {
      if (intention) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_INTENTION, JSON.stringify(intention));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_INTENTION);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  },

  getHistory: (): Intention[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTENTION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistory: (intention: Intention): void => {
    try {
      const history = storage.getHistory();
      const updated = [intention, ...history].slice(0, 50); // 最多保留50条
      localStorage.setItem(STORAGE_KEYS.INTENTION_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage error', e);
    }
  },

  getCondition: (defaultCondition: ExperimentCondition): ExperimentCondition => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.CONDITION) as ExperimentCondition;
      if (val === 'A' || val === 'B' || val === 'C') return val;
      return defaultCondition;
    } catch {
      return defaultCondition;
    }
  },

  setCondition: (condition: ExperimentCondition): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONDITION, condition);
    } catch (e) {
      console.error('Storage error', e);
    }
  }
};
