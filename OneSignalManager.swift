//
//  OneSignalManager.swift
//  IntentRecovery
//
//  Created for OneSignal iOS SDK v5.x integration.
//

import Foundation
import UIKit
import OneSignalFramework

/// Centralized manager for handling OneSignal push notifications and user state
@objc final public class OneSignalManager: NSObject {
    
    // MARK: - Singleton
    public static let shared = OneSignalManager()
    
    // MARK: - Properties
    private var isInitialized = false
    private var configuredAppId: String?
    
    private override init() {
        super.init()
    }
    
    // MARK: - Initialization
    
    /// Initializes OneSignal with the specified App ID and launch options.
    /// - Parameters:
    ///   - appId: The OneSignal App ID from dashboard (or fallback to Info.plist value)
    ///   - launchOptions: The launch options dictionary from UIApplicationDelegate
    @objc public func initialize(withAppId appId: String? = nil, launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) {
        guard !isInitialized else {
            print("[OneSignalManager] Already initialized.")
            return
        }
        
        let targetAppId = appId ?? Bundle.main.object(forInfoDictionaryKey: "OneSignalAppId") as? String ?? "YOUR_ONESIGNAL_APP_ID"
        self.configuredAppId = targetAppId
        
        // 1. Enable verbose logging for debugging during development
        #if DEBUG
        OneSignal.Debug.setLogLevel(.LL_VERBOSE)
        #else
        OneSignal.Debug.setLogLevel(.LL_WARN)
        #endif
        
        // 2. Initialize OneSignal
        OneSignal.initialize(targetAppId, withLaunchOptions: launchOptions)
        
        // 3. Setup notification click listener
        OneSignal.Notifications.addClickListener(self)
        
        // 4. Setup foreground notification display policy listener
        OneSignal.Notifications.addForegroundLifecycleListener(self)
        
        // 5. Setup push subscription observer
        OneSignal.User.pushSubscription.addObserver(self)
        
        isInitialized = true
        print("[OneSignalManager] OneSignal initialized successfully with App ID: \(targetAppId)")
    }
    
    // MARK: - Permissions & Subscriptions
    
    /// Requests push notification authorization with system prompt
    /// - Parameter fallbackToSettings: If true and previously denied, may direct user to Settings
    /// - Parameter completion: Callback with permission result
    @objc public func requestNotificationPermission(fallbackToSettings: Bool = false, completion: ((Bool) -> Void)? = nil) {
        DispatchQueue.main.async {
            OneSignal.Notifications.requestPermission({ accepted in
                print("[OneSignalManager] User push notification permission response: \(accepted)")
                completion?(accepted)
            }, fallbackToSettings: fallbackToSettings)
        }
    }
    
    /// Returns the current push subscription ID if available
    @objc public func getPushSubscriptionId() -> String? {
        return OneSignal.User.pushSubscription.id
    }
    
    /// Returns whether the device is currently opted in to push
    @objc public func isOptedIn() -> Bool {
        return OneSignal.User.pushSubscription.optedIn
    }
    
    // MARK: - User & Tag Management
    
    /// Sets tags to segment users based on their active intention and study condition
    /// - Parameters:
    ///   - intention: The intention text
    ///   - condition: The experiment condition group (A, B, or C)
    @objc public func trackIntention(text: String, condition: String) {
        let tags: [String: String] = [
            "last_intention": String(text.prefix(60)),
            "condition_group": condition,
            "updated_at": String(Int(Date().timeIntervalSince1970))
        ]
        OneSignal.User.addTags(tags)
    }
    
    /// Logs in a user with a unique external user ID
    /// - Parameter externalId: User identifier
    @objc public func setExternalUserId(_ externalId: String) {
        OneSignal.login(externalId)
    }
    
    /// Logs out current user and unlinks external user ID
    @objc public func logoutUser() {
        OneSignal.logout()
    }
}

// MARK: - OSNotificationClickListener
extension OneSignalManager: OSNotificationClickListener {
    public func onClick(event: OSNotificationClickEvent) {
        let notification = event.notification
        print("[OneSignalManager] Push notification clicked: \(notification.notificationId ?? "")")
        
        if let additionalData = notification.additionalData {
            print("[OneSignalManager] Additional data payload: \(additionalData)")
            
            // Post internal notification for deep linking into Intent Recovery UI
            NotificationCenter.default.post(
                name: NSNotification.Name("OneSignalNotificationOpened"),
                object: nil,
                userInfo: additionalData
            )
        }
    }
}

// MARK: - OSNotificationLifecycleListener (Foreground Display)
extension OneSignalManager: OSNotificationLifecycleListener {
    public func onWillDisplay(event: OSNotificationWillDisplayEvent) {
        let notification = event.notification
        print("[OneSignalManager] Notification received in foreground: \(notification.title ?? "")")
        
        // Show banner and play sound even when app is active
        event.preventDefault()
        event.notification.display()
    }
}

// MARK: - Push Subscription Observer
extension OneSignalManager: OSNotificationPermissionObserver {
    public func onNotificationPermissionDidChange(_ permission: Bool) {
        print("[OneSignalManager] Notification permission state updated: \(permission)")
    }
}
