# Language Gems Mobile App Guide

## Overview

Your Language Gems website is now configured as a **hybrid mobile app** using Capacitor. The app loads your production website (`https://languagegems.com`) inside a native wrapper, giving you:

- ✅ **App Store presence** (iOS & Android)
- ✅ **Push notifications** (can add later)
- ✅ **Native features** (camera, haptics, etc. if needed)
- ✅ **Instant updates** - no app store submission for content changes
- ✅ **Zero code duplication** - same codebase, same deployment

## Quick Start

### Prerequisites
- **iOS**: Xcode 15+ (Mac only)
- **Android**: Android Studio (Mac, Windows, or Linux)

### Open in IDE

```bash
# iOS (requires Mac with Xcode)
npm run cap:ios

# Android
npm run cap:android
```

### First Time Setup

1. **Sync Capacitor** (copies native configs):
   ```bash
   npm run cap:sync
   ```

2. **Open in Xcode/Android Studio**:
   ```bash
   npm run cap:ios     # Opens Xcode
   npm run cap:android # Opens Android Studio
   ```

3. **Run on Simulator/Device**:
   - iOS: Press ▶️ in Xcode
   - Android: Press ▶️ in Android Studio

## Project Structure

```
language-gems-recovered/
├── ios/                    # Xcode project (auto-generated)
├── android/                # Android Studio project (auto-generated)  
├── capacitor.config.ts     # Capacitor configuration
├── public/
│   ├── sw.js               # Service Worker (offline support)
│   ├── offline.html        # Static offline fallback
│   └── manifest.json       # Web App Manifest
├── src/app/offline/        # Next.js offline page
└── (your existing code)    # Unchanged!
```

## Offline Support ✅

Your app now includes offline handling:

- **Service Worker** (`public/sw.js`) - Caches visited pages and assets
- **Offline Page** (`/offline`) - Beautiful branded fallback when network unavailable
- **Auto-reconnect** - Automatically refreshes when connection returns

This means:
- Users won't see ugly browser "No Internet" errors
- Previously visited pages work offline
- Apple won't reject for "minimal native functionality"

## Configuration

Edit `capacitor.config.ts` to change:

### Production URL
```typescript
server: {
  url: 'https://languagegems.com',  // Your live site
}
```

### Development (Local Testing)
```typescript
server: {
  url: 'http://localhost:3000',  // Point to local dev server
  cleartext: true,               // Allow HTTP
}
```

## App Store Submission

### iOS (Apple App Store)

1. Open project in Xcode: `npm run cap:ios`
2. Set your Team/Signing in Xcode
3. Add App Icons (replace in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`)
4. Add Splash Screen images
5. Archive → Distribute → App Store Connect

### Android (Google Play Store)

1. Open project in Android Studio: `npm run cap:android`
2. Generate signed APK/AAB: Build → Generate Signed Bundle
3. Add launcher icons (replace in `android/app/src/main/res/`)
4. Upload to Google Play Console

## Adding Native Features Later

If you need native features, install Capacitor plugins:

```bash
# Push Notifications
npm install @capacitor/push-notifications
npx cap sync

# Camera
npm install @capacitor/camera
npx cap sync

# Haptics (vibration)
npm install @capacitor/haptics
npx cap sync
```

## Troubleshooting

### "App shows blank screen"
- Check that `https://languagegems.com` is accessible
- For development, ensure `localhost:3000` is running

### "Can't build iOS"
- Requires Mac with Xcode
- Run `npm run cap:sync` after any config changes

### "Android build fails"
- Ensure Android SDK is installed
- Accept Android SDK licenses: `sdkmanager --licenses`

## What Stays Unchanged

Your existing web deployment pipeline is **completely unaffected**:
- `npm run dev` → Local development
- `npm run build` → Vercel production build  
- Git push → Automatic Vercel deployment

The mobile app simply loads your deployed website. Any changes you push to Vercel appear instantly in the app (no app store update required).

## FAQs

**Q: Is this a PWA?**  
A: No. This is a native app wrapper. It appears in the App Store, has a proper app icon, and can access native device features.

**Q: Can users tell it's a "wrapped" website?**  
A: No. There's no browser URL bar, it launches like a native app, and your games (Phaser/Pixi) run identically.

**Q: Do I need to submit updates to the app store?**  
A: Only for native changes (new plugins, app icon, etc.). Content and feature updates deploy via Vercel and appear instantly.

**Q: What about offline support?**  
A: Currently requires internet. Can add offline caching with Service Workers if needed.
