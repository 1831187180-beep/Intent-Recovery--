// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "IntentRecoveryOneSignal",
    platforms: [
        .iOS(.v14)
    ],
    products: [
        .library(
            name: "IntentRecoveryOneSignal",
            targets: ["IntentRecoveryOneSignal"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/OneSignal/OneSignal-iOS-SDK", .upToNextMajor(from: "5.0.0"))
    ],
    targets: [
        .target(
            name: "IntentRecoveryOneSignal",
            dependencies: [
                .product(name: "OneSignalFramework", package: "OneSignal-iOS-SDK")
            ],
            path: "Sources"
        ),
    ]
)
