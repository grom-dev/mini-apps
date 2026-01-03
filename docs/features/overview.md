---
title: Features Overview
---

# Mini App Features

This page outlines all the features available in Mini Apps.

## Core

These are the core modules that most of the features depend on:

- [Launch Parameters](./launch-params) — read parameters passed to the app when it was launched.
- [WebView Bridge](./bridge) — communicate with the hosting Telegram client.

## Essentials

Essential app lifecycle and behavior controls:

- [Lifecycle](./lifecycle) — signal when app is ready, track whether it's active, etc.
- [Behavior](./behavior) — control app closing, swipe, and orientation behavior.
- [Links](./links) — open Telegram and external links.

## Interface

Features for controlling visual elements and appearance of the app:

- [Theme](./theme) — adjust app appearance based on user's color theme.
- [Viewport](./viewport) — control viewport dimensions and safe area insets.
- [Fullscreen](./fullscreen) — control fullscreen mode of the app.
- [Bottom Buttons](./bottom-buttons) — control main and secondary buttons in the app bottom bar.
- [Back Button](./back-button) — control back button in the app header.
- [Settings Button](./settings-button) — control settings button in the app context menu.
- [Popup](./popup) — show a native popup to a user.
- [Loading Screen](./loading-screen) — customize loading screen of the app.

## Device

Features related to device and operating system:

- [Haptic](./haptic) — trigger vibrations to provide tactile user feedback.
- [Biometrics](./biometrics) — authenticate a user using biometric sensors.
- [Geolocation](./geolocation) — request and access user's location data.
- [Motion Tracking](./motion-tracking) — access device accelerometer, gyroscope, and orientation sensors.
- [QR Scanner](./qr-scanner) — scan QR codes using the device camera.
- [File Downloads](./file-downloads) — download files to the user's device.
- [Virtual Keyboard](./virtual-keyboard) — control virtual on-screen keyboard.
- [Clipboard](./clipboard) — read text from the clipboard.
- [Home Screen](./home-screen) — add home screen shortcut to the app.
- [Hardware Information](./hardware-info) — adjust app behavior based on device characteristics.

## Telegram

Features specific to Telegram API:

- [Payments](./payments) — open native invoice popup right in the app.
- [Permissions](./permissions) — request permissions to send messages or access phone number.
- [Media Sharing](./media-sharing) — prompt a user to share prepared stories and messages.
- [Data Sending](./data-sending) — send custom data to the bot from the app.
- [Inline Query](./inline-query) — pre-fill inline query in any chat from the app.
- [Emoji Status](./emoji-status) — control custom emoji status for the user.

## Storage

Features for persisting data of the app:

- [Cloud Storage](./cloud-storage) — store app data on the Telegram servers.
- [Device Storage](./device-storage) — store app data on the user's device.
- [Secure Storage](./secure-storage) — store sensitive app data on the user's device.
