//
//  AppDelegate.swift
//  IntentRecovery
//
//  Standard UIKit Application Delegate configuration for OneSignal iOS SDK.
//

import UIKit
import OneSignalFramework

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        
        // Initialize OneSignal centralized manager
        OneSignalManager.shared.initialize(launchOptions: launchOptions)
        
        return true
    }

    // MARK: UISceneSession Lifecycle (iOS 13+)
    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
}
