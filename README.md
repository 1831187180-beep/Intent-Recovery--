# OneSignal iOS SDK Integration Guide (v5.x)

This directory contains the complete, production-ready iOS implementation for OneSignal SDK (v5.x) following the official OneSignal iOS AI prompts and architectural standards.

---

## 📁 File Structure

```text
ios/
├── OneSignalManager.swift                    # Centralized, thread-safe OneSignal manager
├── AppDelegate.swift                         # UIKit AppDelegate setup
├── IntentRecoveryApp.swift                   # SwiftUI App entry point integration
├── NotificationServiceExtension/
│   └── NotificationService.swift             # iOS Notification Service Extension (Rich push & badges)
├── OneSignalManagerTests.swift               # Unit tests for OneSignalManager
├── Podfile                                   # CocoaPods configuration
├── Package.swift                             # Swift Package Manager (SPM) manifest
└── README.md                                 # Setup instructions
```

---

## 🚀 Xcode Setup Instructions

### 1. Adding OneSignal to your Xcode Project

#### Option A: Swift Package Manager (SPM - Recommended)
1. Open your project in Xcode.
2. Go to **File** > **Add Package Dependencies...**
3. Enter repository URL: `https://github.com/OneSignal/OneSignal-iOS-SDK`
4. Choose version rule: **Up to Next Major from 5.0.0**
5. Add `OneSignalFramework` to your main app target and `OneSignalExtension` to your Notification Service Extension target.

#### Option B: CocoaPods
Run in terminal:
```bash
pod install
```
Open `.xcworkspace`.

---

### 2. Configure Capabilities & Entitlements

In Xcode, select your main target -> **Signing & Capabilities**:
1. Click **+ Capability** -> **Push Notifications**
2. Click **+ Capability** -> **Background Modes**
   - Check **Remote notifications**
   - Check **Background fetch**

---

### 3. Add Notification Service Extension Target

1. In Xcode: **File** > **New** > **Target...**
2. Select **Notification Service Extension**, click **Next**.
3. Product Name: `OneSignalNotificationServiceExtension`.
4. Replace the contents of `NotificationService.swift` with `ios/NotificationServiceExtension/NotificationService.swift`.
5. Set the Deployment Target for the extension to **iOS 14.0 or higher**.

---

### 4. Configure OneSignal App ID

Add your OneSignal App ID to your main target's `Info.plist`:
```xml
<key>OneSignalAppId</key>
<string>YOUR-ONESIGNAL-APP-ID-HERE</string>
```
Or pass it directly in code to `OneSignalManager.shared.initialize(withAppId: "YOUR_APP_ID")`.

---

## 📱 Web & iOS Safari Web Push Support
The web application also integrates `react-onesignal` and `OneSignalSDKWorker.js` for standalone Progressive Web App (PWA) push notifications on iOS Safari 16.4+ when added to the Home Screen.
