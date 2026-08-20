import { oneSignalManager } from './oneSignalManager';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Attempt permission request via OneSignal manager
  try {
    const granted = await oneSignalManager.requestPermission();
    if (granted) return true;
  } catch {
    // Continue to standard fallback
  }

  // Fallback to browser Notification API
  if ('Notification' in window) {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch {
        return false;
      }
    }
  }
  return false;
}

export function sendWebNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'intent-recovery-reminder',
      });
    } catch {
      // Mobile browsers without service worker active may ignore constructor
    }
  }
}

