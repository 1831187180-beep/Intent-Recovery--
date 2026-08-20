import OneSignal from 'react-onesignal';

export interface OneSignalStatus {
  isInitialized: boolean;
  isPushSupported: boolean;
  permission: boolean;
  subscriptionId: string | null;
  optedOut: boolean;
}

class OneSignalManager {
  private static instance: OneSignalManager;
  private isInitialized = false;
  private appId: string;

  private constructor() {
    this.appId = ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_ONESIGNAL_APP_ID) || '';
  }

  public static getInstance(): OneSignalManager {
    if (!OneSignalManager.instance) {
      OneSignalManager.instance = new OneSignalManager();
    }
    return OneSignalManager.instance;
  }

  /**
   * Initializes the OneSignal Web SDK
   */
  public async initialize(customAppId?: string): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    const targetAppId = customAppId || this.appId;
    if (!targetAppId || targetAppId === 'YOUR_ONESIGNAL_APP_ID') {
      console.warn('[OneSignal] No valid App ID provided. Push notifications will remain in simulated mode.');
      return false;
    }

    try {
      await OneSignal.init({
        appId: targetAppId,
        allowLocalhostAsSecureOrigin: true,
      });

      this.isInitialized = true;
      console.log('[OneSignal] Successfully initialized with App ID:', targetAppId);

      // Register listeners for permission and subscription changes
      OneSignal.User.PushSubscription.addEventListener('change', (event) => {
        console.log('[OneSignal] Push subscription status changed:', event);
      });

      return true;
    } catch (error) {
      console.error('[OneSignal] Initialization error:', error);
      return false;
    }
  }

  /**
   * Requests push notification permissions from the user
   */
  public async requestPermission(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          // Fallback to standard browser notification if OneSignal is not yet configured with valid App ID
          if (typeof window !== 'undefined' && 'Notification' in window) {
            const perm = await Notification.requestPermission();
            return perm === 'granted';
          }
          return false;
        }
      }

      await OneSignal.Notifications.requestPermission();
      return OneSignal.Notifications.permission;
    } catch (error) {
      console.error('[OneSignal] Request permission error:', error);
      return false;
    }
  }

  /**
   * Gets current subscription details
   */
  public async getStatus(): Promise<OneSignalStatus> {
    const isPushSupported = typeof window !== 'undefined' && ('PushManager' in window || 'Notification' in window);
    if (!this.isInitialized) {
      const standardPermission = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
      return {
        isInitialized: false,
        isPushSupported,
        permission: standardPermission,
        subscriptionId: null,
        optedOut: false,
      };
    }

    try {
      const permission = OneSignal.Notifications.permission;
      const subscriptionId = OneSignal.User.PushSubscription.id || null;
      const optedOut = Boolean(OneSignal.User.PushSubscription.optedIn === false);

      return {
        isInitialized: this.isInitialized,
        isPushSupported,
        permission,
        subscriptionId,
        optedOut,
      };
    } catch {
      return {
        isInitialized: this.isInitialized,
        isPushSupported,
        permission: false,
        subscriptionId: null,
        optedOut: false,
      };
    }
  }

  /**
   * Tag user with active intention details for segmentation or scheduled messaging
   */
  public async trackIntention(intentionText: string, condition: string): Promise<void> {
    if (!this.isInitialized) return;
    try {
      await OneSignal.User.addTags({
        last_intention: intentionText.slice(0, 50),
        condition_group: condition,
        last_active_timestamp: String(Date.now()),
      });
    } catch (error) {
      console.error('[OneSignal] Failed to update user tags:', error);
    }
  }
}

export const oneSignalManager = OneSignalManager.getInstance();
