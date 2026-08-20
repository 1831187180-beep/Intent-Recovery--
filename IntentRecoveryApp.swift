//
//  IntentRecoveryApp.swift
//  IntentRecovery
//
//  SwiftUI App Entry Point with OneSignal iOS SDK Integration.
//

import SwiftUI
import OneSignalFramework

struct IntentRecoveryApp: App {
    
    // Wire UIKit AppDelegate adapter for OneSignal setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    // Example: Prompt user for push notifications after engaging with UI
                    OneSignalManager.shared.requestNotificationPermission { granted in
                        print("Push notifications enabled in SwiftUI View: \(granted)")
                    }
                }
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Intent Recovery")
                .font(.title)
                .fontWeight(.bold)
            
            Text("External Intention Memory")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
    }
}
