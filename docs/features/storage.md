---
title: Storage
---

# Storage

Mini apps can persist data using different storage types.

## Cloud Storage

`CloudStorage` module provides access to cloud storage. Data is stored on Telegram servers and is, therefore, shared across all Telegram clients.

### Limitations

- Each bot can store up to 1024 items per user;
- Key: 1-128 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed;
- Value: 0-4096 characters.

## Device Storage

`DeviceStorage` module provides access to persistent storage on the user’s device. It's conceptually similar to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but integrated within the Telegram client. All data is stored locally and is available only to the bot that created it.

### Limitations

- Each bot can store up to 5 MB per user.

## Secure Storage

`SecureStorage` module provides access to a secure storage on the user’s device. It is suitable for storing tokens, secrets, authentication state, and other sensitive user-specific information.

- on iOS, it uses the system Keychain;
- on Android, it uses the Keystore.

This ensures that all stored values are encrypted at rest and inaccessible to unauthorized applications.

### Limitations

- Each bot can store up to 10 items per user.
