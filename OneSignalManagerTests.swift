//
//  OneSignalManagerTests.swift
//  IntentRecoveryTests
//
//  Unit tests for OneSignal iOS SDK manager
//

import XCTest
@testable import IntentRecovery

final class OneSignalManagerTests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testManagerSingletonInstance() throws {
        let instance1 = OneSignalManager.shared
        let instance2 = OneSignalManager.shared
        XCTAssertTrue(instance1 === instance2, "OneSignalManager should be a single shared instance.")
    }

    func testTrackIntentionTagging() throws {
        let manager = OneSignalManager.shared
        // Ensure tracking does not crash with various input strings
        manager.trackIntention(text: "Test search query", condition: "C")
        manager.trackIntention(text: "", condition: "A")
    }
}
