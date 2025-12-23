---
title: Features Overview
---

# Mini App Features

This page outlines all the features available in Mini Apps.

## Core

- [Launch Parameters](./launch-params) — read parameters passed to the app when it was launched.
- [Webview Bridge](./bridge) — communicate with the hosting Telegram client.

## Essentials

Essential app lifecycle and behavior controls:

- [Lifecycle](./lifecycle) — signal when app is ready, track whether it's active, etc.
- [Closing Behavior](./closing-behavior) — control app closing behavior.
- [Swipes Behavior](./swipes-behavior) — control swipe gestures behavior.
- [Orientation Behavior](./orientation-behavior) — control device orientation lock behavior.
- [Links](./links) — open Telegram and external links.

## Interface

Features for controlling visual elements and appearance of the app:

- [Theming](./theming) — adjust app appearance based on user color theme.
- [Viewport](./viewport) — track changes in viewport and safe area sizes.
- [Fullscreen](./fullscreen) — control fullscreen mode of the app.
- [Bottom Buttons](./bottom-buttons) — control main and secondary buttons in the app bottom bar.
- [Back Button](./back-button) — control back button in the app header.
- [Settings Button](./settings-button) — control settings button in the app context menu.
- [Popup](./popup) — show native popup to a user.
- [Loading Screen](./loading-screen) — customize loading screen of your app.

## Device

Features related to device and operating system:

- [Haptic](./haptic) — trigger vibrations to provide tactile user feedback.
- [Biometrics](./biometrics) — authenticate users using biometric sensors.
- [Geolocation](./geolocation) — request and access user location data.
- [Motion Tracking](./motion-tracking) — access device accelerometer, gyroscope, and orientation sensors.
- [QR-Scanner](./qr-scanner) — scan QR codes using device camera.
- [File Downloads](./file-downloads) — download files to the user's device.
- [Virtual Keyboard](./virtual-keyboard) — control virtual on-screen keyboard.
- [Clipboard](./clipboard) — read text from the clipboard.
- [Homescreen](./homescreen) — add home screen shortcut to the app.
- [Hardware Information](./hardware-info) — adjust app behavior based on device characteristics.

## Telegram

Features specific to Telegram API:

- [Payments](./payments) — open native invoice popup right in the app.
- [Permissions](./permissions) — request permissions to send messages or access contact information.
- [Media Sharing](./media-sharing) — suggest a user to share prepared stories and messages.
- [Data Sending](./data-sending) — send custom data to your bot from the app.
- [Inline Query](./inline-query) — pre-fill inline query in any chat from the app.
- [Emoji Status](./emoji-status) — control custom emoji status for the user.

## Storage

Features for persisting data of your app:

- [Cloud Storage](./cloud-storage) — store app data on the Telegram servers.
- [Device Storage](./device-storage) — store app data on the user device.
- [Secure Storage](./secure-storage) — store sensitive app data on the user device.
