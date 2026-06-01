# Diagnostic & Known Issues Tracker

Use this document to log, prioritize, and track edge cases, browser-specific limitations, and architectural quirks in Occasionly.

---

## 📡 1. Synchronization & Offline Edge Cases
### 1.1 Multi-Device Offline Version Conflicts
- **Symptom**: When two devices edit the same Connection offline, the device that syncs *last* wins (Last-Write-Wins), overwriting the other device's edits.
- **Root Cause**: The conflict resolution engine relies on standard incremental version headers (`version`). Concurrent offline changes are resolved via timestamps and versions during merge.
- **Workaround/Fix**: Expected behavior. Diagnostic conflict history logs are preserved inside the **Settings Hub** conflict history viewer so users can restore overridden versions.

---

## 📱 2. Mobile Browser Quirks & Layouts
### 2.1 Safari iOS Standalone PWA Background Sync
- **Symptom**: Offline sync queues fail to flush automatically in the background when the app is closed on older iOS devices.
- **Root Cause**: iOS WebKit engines restrict service worker execution and background sync APIs when web apps are not actively focused in standalone PWA configurations.
- **Workaround/Fix**: Standard automatic sync triggers instantly as soon as the user opens the application. Manual synchronization can also be forced in the **Settings Hub** sync dashboard.

---

## 🤖 3. AI Wish Generator Key Restrictions
### 3.1 Rate Limiting on Free Tier Gemini Key
- **Symptom**: Clicking "Generate AI Wish" occasionally hangs or returns the local fallback message.
- **Root Cause**: The free tier Gemini 1.5 Flash API key is subject to standard quota limitations (RPM: 15, RPD: 1500).
- **Workaround/Fix**: Handled. The service automatically falls back to a clean, structured offline template wish: `"Wishing [Person] a wonderful [Occasion]! 🎉"` to avoid blocking client UI operations.
