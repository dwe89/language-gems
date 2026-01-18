# 📱 Language Gems - App Store & Play Store Submission Guide

> **Last Updated:** January 2026  
> **Compliance Status:** ✅ Ready for Submission (after completing checklist)

---

## 🎯 Quick Submission Checklist

### Before Submitting to Either Store

- [ ] Switch to production configuration (see below)
- [ ] Run `npm run build` to create production web assets
- [ ] Run `npx cap sync` to sync assets to native projects
- [ ] Test on physical devices (not just emulators/simulators)
- [ ] Verify all deep links work (`languagegems://` and `https://languagegems.com`)

---

## 🍎 Apple App Store Submission

### Pre-Submission Checklist

- [x] **Privacy Manifest** (`PrivacyInfo.xcprivacy`) - ✅ Created
- [x] **Face ID Usage Description** - ✅ Added to Info.plist
- [x] **Export Compliance** (`ITSAppUsesNonExemptEncryption`) - ✅ Added
- [x] **Background Modes** (remote-notification) - ✅ Added
- [x] **App Icon** (1024x1024) - ✅ Present
- [x] **Bundle ID** (`com.languagegems.app`) - ✅ Configured
- [x] **Minimum iOS Version** (15.0) - ✅ Configured

### Required App Store Connect Information

1. **Privacy Policy URL**: `https://languagegems.com/legal/privacy`
2. **Support URL**: `https://languagegems.com/support`
3. **Marketing URL**: `https://languagegems.com`

### App Privacy Questionnaire (Data Collection)

When filling out Apple's App Privacy questionnaire, declare:

| Data Type | Collected | Linked to Identity | Used for Tracking |
|-----------|-----------|-------------------|-------------------|
| User ID | ✅ Yes | ✅ Yes | ❌ No |
| Email | ✅ Yes | ✅ Yes | ❌ No |
| Name | ✅ Yes | ✅ Yes | ❌ No |
| Gameplay Content | ✅ Yes | ✅ Yes | ❌ No |

**Purpose**: App Functionality (learning progress tracking)

### Build & Submit Commands

```bash
# 1. Switch to production config
cp capacitor.config.ts capacitor.config.dev.ts
cp capacitor.config.production.ts capacitor.config.ts

# 2. Build web assets
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Open Xcode
npx cap open ios

# 5. In Xcode:
#    - Select "Any iOS Device" as build target
#    - Product → Archive
#    - Distribute App → App Store Connect
```

### Version Numbers

Before archiving, update in Xcode:
- **MARKETING_VERSION**: `1.0.0` (user-facing version)
- **CURRENT_PROJECT_VERSION**: `1` (increment for each build)

---

## 🤖 Google Play Store Submission

### Pre-Submission Checklist

- [x] **Target SDK 35** - ✅ Configured (meets 2024+ requirements)
- [x] **Min SDK 23** - ✅ Configured (Android 6.0+)
- [x] **App Icons** (all densities) - ✅ Present
- [x] **ProGuard Rules** - ✅ Configured
- [x] **Minification Enabled** - ✅ Enabled for release builds
- [x] **Bundle ID** (`com.languagegems.app`) - ✅ Configured
- [ ] **Signing Key** - ⚠️ You need to set up a keystore

### Required Play Console Information

1. **Privacy Policy URL**: `https://languagegems.com/legal/privacy`
2. **App Description**: (min 80 characters)
3. **Screenshots**: Phone (2+), Tablet (optional but recommended)
4. **Feature Graphic**: 1024 x 500 px

### Data Safety Questionnaire

When filling out Google's Data Safety section, declare:

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Email | ✅ Yes | ❌ No | Account management |
| Name | ✅ Yes | ❌ No | Account management |
| User IDs | ✅ Yes | ❌ No | App functionality |
| App activity | ✅ Yes | ❌ No | App functionality |

### Create Signing Keystore

```bash
# Create a keystore (DO THIS ONCE, KEEP IT SAFE!)
keytool -genkey -v -keystore language-gems-release.keystore \
  -alias language-gems \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Store these SECURELY:
# - language-gems-release.keystore
# - The password you set
# - The alias (language-gems)
```

### Configure Signing in build.gradle

Add to `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('language-gems-release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'language-gems'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... existing config
        }
    }
}
```

### Build & Submit Commands

```bash
# 1. Switch to production config
cp capacitor.config.ts capacitor.config.dev.ts
cp capacitor.config.production.ts capacitor.config.ts

# 2. Build web assets
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Build release AAB (preferred for Play Store)
cd android
./gradlew bundleRelease

# 5. The AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Version Numbers

Before building, update in `android/app/build.gradle`:
- **versionName**: `"1.0.0"` (user-facing version)
- **versionCode**: `1` (must increment for each upload)

---

## ⚠️ CRITICAL: Push Notifications Setup

### iOS (APNs)

1. Create an Apple Developer account (if not already)
2. Go to Certificates, Identifiers & Profiles
3. Create an APNs Key or APNs Certificate
4. Configure in your backend (Supabase/Firebase)

### Android (FCM)

1. Create a Firebase project at https://console.firebase.google.com
2. Add an Android app with package name `com.languagegems.app`
3. Download `google-services.json`
4. Place it in `android/app/google-services.json`

---

## 🔐 Security Recommendations for Production

1. **Never commit** signing keystores or passwords to git
2. **Use environment variables** or CI/CD secrets for signing
3. **Rotate API keys** before production launch
4. **Enable** Google Play App Signing (recommended)
5. **Test** on multiple device sizes and OS versions

---

## 📋 Common Rejection Reasons & How to Avoid Them

### Apple App Store

| Rejection Reason | Prevention |
|-----------------|------------|
| Missing privacy policy | Add URL to App Store Connect |
| Broken links | Test all features before submission |
| Placeholder content | Remove all "Lorem ipsum" or test data |
| Crashes on launch | Test on physical devices |
| Missing privacy descriptions | ✅ Already added |

### Google Play Store

| Rejection Reason | Prevention |
|-----------------|------------|
| Incorrect content rating | Fill out questionnaire honestly |
| Missing data safety info | Complete Data Safety section |
| Target SDK too low | ✅ Already at 35 |
| Deceptive behavior | Accurate app description |

---

## 📞 Support

If you encounter issues during submission:
- Apple: https://developer.apple.com/contact/
- Google: https://support.google.com/googleplay/android-developer/

---

*This guide was generated based on App Store & Play Store requirements as of January 2026.*
