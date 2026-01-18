# 📱 Language Gems Mobile App - Native Transformation Master Plan

**Created:** January 17, 2026  
**Status:** In Progress  
**Goal:** Transform the Capacitor hybrid app from a "web wrapper" into a native-feeling mobile experience for both teachers and students.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Problems](#current-problems)
3. [Architecture Overview](#architecture-overview)
4. [Phase 1: Fix Critical Navigation & Auth](#phase-1-fix-critical-navigation--auth)
5. [Phase 2: Native App Shell](#phase-2-native-app-shell)
6. [Phase 3: Visual Polish](#phase-3-visual-polish)
7. [Phase 4: Native Features](#phase-4-native-features)
8. [File Reference](#file-reference)
9. [Testing Checklist](#testing-checklist)

---

## Executive Summary

Language Gems currently uses **Capacitor** to wrap the Next.js website in a native iOS/Android shell. The current implementation has issues:
- Navigation links are broken
- The app looks like a web wrapper, not a native app
- Authentication doesn't persist properly across navigation
- Web-only elements (nav, footer) still appear in the native app
- The bottom tab bar doesn't appear on all screens

This plan transforms the app into a native-feeling experience while maintaining a single codebase.

---

## Current Problems

### Problem 1: Broken Tab Bar Navigation
**Location:** `src/components/capacitor/MobileTabBar.tsx`

The tab bar links to routes that don't exist:
```typescript
// CURRENT (BROKEN):
{ href: '/student-dashboard/progress', ... }  // Should be /learner-dashboard/progress
{ href: '/student-dashboard/profile', ... }   // This page DOES NOT EXIST
```

**Fix Required:** Update routes and create missing pages.

---

### Problem 2: Tab Bar Not Visible on All Pages
**Location:** `src/app/layout.tsx`

The `MobileTabBar` is rendered in the root layout but is being overlapped or hidden on many pages because:
1. Individual page layouts don't account for tab bar height
2. Some pages have their own navigation that overlays it
3. The tab bar visibility logic may be incorrect

**Fix Required:** Ensure consistent bottom padding on all pages and fix z-index stacking.

---

### Problem 3: Login Required on Every Page
**Location:** Multiple page components

When users click "Games" from the mobile home, they're redirected to login because:
1. The `/activities` page or game pages have auth guards that redirect
2. The session isn't being properly detected on the client
3. Web-focused middleware redirects don't account for native app flow

**Fix Required:** 
- Create a native app login flow that persists
- The app should authenticate ONCE at launch
- All subsequent navigation should use the cached session

---

### Problem 4: Web Navigation Still Visible
**Location:** Various layout files and `ClientLayout`

In native mode, users still see:
- The main website header/navigation bar
- The footer
- Cookie banners and other web-specific UI

**Fix Required:** Use the `WebOnly` and `NativeOnly` components to hide web elements in native mode.

---

### Problem 5: No Teacher-Specific Mobile Experience
**Location:** `src/components/capacitor/MobileTabBar.tsx`

The current tab bar is student-focused only. Teachers need:
- Access to their dashboard
- Class management
- Assignment creation
- Analytics

**Fix Required:** Create role-aware tab bar that shows different navigation for teachers vs students.

---

## Architecture Overview

### Key Files to Modify/Create

```
src/
├── app/
│   ├── layout.tsx                    # Root layout - add native app wrapper
│   ├── mobile-home/
│   │   └── page.tsx                  # Student mobile home (EXISTS)
│   ├── mobile-teacher-home/
│   │   └── page.tsx                  # Teacher mobile home (CREATE)
│   ├── mobile-profile/
│   │   └── page.tsx                  # Profile page for native app (CREATE)
│   ├── mobile-progress/
│   │   └── page.tsx                  # Progress page for native app (CREATE)
│   └── (existing pages...)
│
├── components/
│   ├── capacitor/
│   │   ├── CapacitorProvider.tsx     # Platform detection (EXISTS)
│   │   ├── MobileTabBar.tsx          # Bottom tab bar (MODIFY)
│   │   ├── MobileAppWrapper.tsx      # App wrapper (EXISTS)
│   │   ├── MobileHeader.tsx          # Native-style header (CREATE)
│   │   ├── MobileAuthGate.tsx        # Auth gate for native app (CREATE)
│   │   ├── MobilePageWrapper.tsx     # Per-page wrapper (CREATE)
│   │   └── index.ts                  # Exports (MODIFY)
│   │
│   └── layout/
│       └── ClientLayout.tsx          # Add native app detection (MODIFY)
│
└── (rest of app...)

android/
├── app/src/main/
│   ├── AndroidManifest.xml           # App permissions (MODIFY)
│   └── res/
│       └── drawable/
│           └── splash.xml            # Splash screen (MODIFY)

ios/
└── App/App/
    ├── Info.plist                    # iOS config (MODIFY)
    └── Assets.xcassets/              # Add app icons and splash
```

---

## Phase 1: Fix Critical Navigation & Auth

### Task 1.1: Update MobileTabBar Routes

**File:** `src/components/capacitor/MobileTabBar.tsx`

**Changes Required:**

```typescript
// Replace the current navItems with role-aware navigation:

// FOR STUDENTS:
const studentNavItems = [
    {
        icon: Home,
        label: 'Home',
        href: '/mobile-home',
        matchPaths: ['/mobile-home', '/learner-dashboard', '/student-dashboard'],
    },
    {
        icon: Gamepad2,
        label: 'Games',
        href: '/activities',
        matchPaths: ['/activities', '/games', '/vocab-master'],
    },
    {
        icon: BarChart3,
        label: 'Progress',
        href: '/mobile-progress',  // New route for mobile
        matchPaths: ['/mobile-progress', '/learner-dashboard/progress'],
    },
    {
        icon: User,
        label: 'Profile',
        href: '/mobile-profile',   // New route for mobile
        matchPaths: ['/mobile-profile', '/account'],
    },
];

// FOR TEACHERS:
const teacherNavItems = [
    {
        icon: Home,
        label: 'Home',
        href: '/mobile-teacher-home',
        matchPaths: ['/mobile-teacher-home', '/dashboard'],
    },
    {
        icon: Users,
        label: 'Classes',
        href: '/dashboard/classes',
        matchPaths: ['/dashboard/classes'],
    },
    {
        icon: ClipboardList,
        label: 'Tasks',
        href: '/dashboard/assignments',
        matchPaths: ['/dashboard/assignments'],
    },
    {
        icon: BarChart3,
        label: 'Analytics',
        href: '/dashboard/analytics',
        matchPaths: ['/dashboard/analytics', '/dashboard/student'],
    },
    {
        icon: User,
        label: 'Profile',
        href: '/mobile-profile',
        matchPaths: ['/mobile-profile', '/account'],
    },
];
```

**Implementation Steps:**
1. Import `useAuth` hook to get user role
2. Create separate nav arrays for students and teachers
3. Conditionally render based on `isTeacher` vs `isStudent/isLearner`
4. Ensure icons are imported: `Users`, `ClipboardList` from lucide-react

---

### Task 1.2: Create Mobile Profile Page

**File:** `src/app/mobile-profile/page.tsx` (CREATE)

**Purpose:** A mobile-optimized profile page that works for both teachers and students.

**Requirements:**
- Show user avatar/initials
- Display user name and email
- Quick settings toggles
- Logout button
- Link to full account settings
- For teachers: show school code
- For students: show class info

**UI Design:**
```
┌─────────────────────────────┐
│     [Avatar Circle]         │
│     "Daniel Etienne"        │
│     daniel@school.edu       │
├─────────────────────────────┤
│ 🔔 Notifications      [>]   │
│ 🌙 Dark Mode         [ON]   │
│ 🔊 Sound Effects     [ON]   │
├─────────────────────────────┤
│ ⚙️ Account Settings   [>]   │
│ 📧 Contact Support    [>]   │
│ 📄 Terms of Service   [>]   │
├─────────────────────────────┤
│      [Log Out Button]       │
│           v1.0.0            │
└─────────────────────────────┘
```

---

### Task 1.3: Create Mobile Progress Page

**File:** `src/app/mobile-progress/page.tsx` (CREATE)

**Purpose:** A mobile-optimized progress/stats page for students.

**Requirements:**
- Reuse logic from `/learner-dashboard/progress/page.tsx`
- Mobile-first responsive design
- Dark theme matching mobile home
- Bottom padding for tab bar (104px)

---

### Task 1.4: Create Mobile Teacher Home

**File:** `src/app/mobile-teacher-home/page.tsx` (CREATE)

**Purpose:** Dashboard for teachers in the mobile app.

**Requirements:**
- Overview of classes
- Quick stats (total students, pending assignments, recent activity)
- Quick action buttons (Create Assignment, View Reports)
- Recent student activity feed
- Dark theme matching brand

---

### Task 1.5: Fix Authentication Flow

**File:** `src/components/capacitor/MobileAuthGate.tsx` (CREATE)

**Purpose:** Wrap the app in an auth gate that handles login once.

**Logic:**
```typescript
export function MobileAuthGate({ children }: { children: ReactNode }) {
    const { isNativeApp, isReady } = useCapacitor();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    
    // Allow auth pages through
    const isAuthPage = pathname?.startsWith('/auth');
    
    // If native app and not logged in, redirect to login
    useEffect(() => {
        if (isReady && isNativeApp && !isLoading) {
            if (!user && !isAuthPage) {
                router.push('/auth/login');
            }
        }
    }, [isReady, isNativeApp, user, isLoading, isAuthPage]);
    
    // Show splash while checking auth
    if (isNativeApp && isLoading) {
        return <MobileSplashScreen />;
    }
    
    return <>{children}</>;
}
```

**Important:** The key fix is that individual pages should NOT redirect to login. Instead, this central gate handles it once.

---

### Task 1.6: Remove Auth Redirects from Game Pages

**Files to check:**
- `src/components/games/GamesPageClient.tsx`
- `src/app/activities/page.tsx`
- Any game-specific pages

**What to change:**
- Remove or modify `useEffect` hooks that redirect to `/auth/login`
- Instead, show an inline "Please log in" message if needed
- Or rely on the `MobileAuthGate` to handle auth

---

## Phase 2: Native App Shell

### Task 2.1: Create MobilePageWrapper Component

**File:** `src/components/capacitor/MobilePageWrapper.tsx` (CREATE)

**Purpose:** Wrap every mobile page to ensure consistent layout.

```typescript
interface Props {
    children: ReactNode;
    title?: string;
    showBackButton?: boolean;
    showHeader?: boolean;
    headerRight?: ReactNode;
    safeAreaTop?: boolean;
    safeAreaBottom?: boolean;
}

export function MobilePageWrapper({
    children,
    title,
    showBackButton = false,
    showHeader = true,
    headerRight,
    safeAreaTop = true,
    safeAreaBottom = true,
}: Props) {
    const { isNativeApp } = useCapacitor();
    
    if (!isNativeApp) {
        return <>{children}</>;
    }
    
    return (
        <div 
            className="min-h-screen bg-[#1a1a2e]"
            style={{
                paddingTop: safeAreaTop ? 'env(safe-area-inset-top, 0px)' : 0,
                paddingBottom: safeAreaBottom ? 'calc(env(safe-area-inset-bottom, 0px) + 80px)' : 0,
            }}
        >
            {showHeader && (
                <MobileHeader 
                    title={title} 
                    showBackButton={showBackButton}
                    rightContent={headerRight}
                />
            )}
            {children}
        </div>
    );
}
```

---

### Task 2.2: Create MobileHeader Component

**File:** `src/components/capacitor/MobileHeader.tsx` (CREATE)

**Purpose:** Native-style header with back button and title.

**Design:**
```
┌─────────────────────────────────────┐
│ [<]     Page Title         [Menu]  │
└─────────────────────────────────────┘
```

**Features:**
- iOS: Large title style, blur background
- Android: Material Design elevation
- Smooth back navigation with haptic feedback
- Optional right-side actions

---

### Task 2.3: Update ClientLayout for Native Mode

**File:** `src/app/components/ClientLayout.tsx` (MODIFY)

**Changes Required:**
1. Import `useCapacitor` and `WebOnly` components
2. Wrap the main navigation in `<WebOnly>` tags
3. Wrap the footer in `<WebOnly>` tags
4. Add padding for tab bar when in native mode

**Example:**
```tsx
import { useCapacitor, WebOnly } from '@/components/capacitor';

export default function ClientLayout({ children }: { children: ReactNode }) {
    const { isNativeApp } = useCapacitor();
    
    return (
        <>
            {/* Hide main nav in native app */}
            <WebOnly>
                <MainNavigation />
            </WebOnly>
            
            {/* Main content with native app padding */}
            <main className={isNativeApp ? 'pb-20' : ''}>
                {children}
            </main>
            
            {/* Hide footer in native app */}
            <WebOnly>
                <Footer />
            </WebOnly>
        </>
    );
}
```

---

### Task 2.4: Add Global Bottom Padding for Tab Bar

**File:** `src/app/globals.css` (MODIFY)

Add CSS to ensure all native app pages have bottom padding:

```css
/* Native app tab bar spacing */
.mobile-app-container {
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 80px) !important;
}

/* Ensure content doesn't go under tab bar */
body.native-app {
    padding-bottom: 80px;
}

/* Tab bar fixed positioning */
.mobile-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
}
```

---

### Task 2.5: Fix Z-Index Stacking

**File:** `src/components/capacitor/MobileTabBar.tsx` (MODIFY)

Ensure the tab bar always appears on top:
```tsx
<nav
    className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-white/10"
    style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}
>
```

---

## Phase 3: Visual Polish

### Task 3.1: Create Animated Splash Screen

**File:** `src/components/capacitor/MobileSplashScreen.tsx` (CREATE)

**Purpose:** Show a branded loading screen while the app initializes.

**Design:**
- Dark background (#1a1a2e)
- Centered Language Gems logo with gem animation
- Subtle loading indicator
- App version at bottom

**Animation:**
- Logo fades in and scales up
- Gems sparkle effect
- Smooth transition to main content

---

### Task 3.2: Add Page Transition Animations

**File:** `src/components/capacitor/PageTransition.tsx` (CREATE)

**Purpose:** Animate between pages like a native app.

**Implementation:**
- iOS: Slide from right (new page) / slide to right (going back)
- Android: Fade up (new page) / fade down (going back)

Use Framer Motion:
```tsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
    ios: {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-30%', opacity: 0 },
    },
    android: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    },
};
```

---

### Task 3.3: Create Loading Skeletons

**File:** `src/components/capacitor/MobileSkeletons.tsx` (CREATE)

**Purpose:** Show skeleton loading states instead of spinners.

**Types needed:**
- `GameCardSkeleton` - For games list
- `StatsSkeleton` - For progress stats
- `ListItemSkeleton` - For generic lists
- `ProfileSkeleton` - For profile page

---

### Task 3.4: Add Pull-to-Refresh

**File:** `src/components/capacitor/PullToRefresh.tsx` (CREATE)

**Purpose:** Native pull-to-refresh on content pages.

**Implementation:**
- Use touch event listeners
- Show refresh indicator when pulling down
- Trigger data refresh on release
- iOS: Circular spinner
- Android: Linear progress indicator

---

### Task 3.5: Update Color Scheme for Consistency

**Ensure all mobile pages use:**
- Background: `#1a1a2e` (dark purple-blue)
- Card backgrounds: `#24243e` or `#2a2a46`
- Primary accent: Purple gradient (`from-purple-500 to-indigo-600`)
- Secondary: Pink accent for highlights
- Text: White with 60% opacity for secondary text
- Borders: `white/5` or `white/10`

---

## Phase 4: Native Features

### Task 4.1: Configure Push Notifications

**Files:**
- `capacitor.config.ts`
- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/AppDelegate.swift`

**Steps:**
1. Install Capacitor push notifications plugin:
   ```bash
   npm install @capacitor/push-notifications
   npx cap sync
   ```

2. Add to CapacitorProvider to request permissions on app launch

3. Create notification handler service

---

### Task 4.2: Add Biometric Authentication (Optional)

**Purpose:** Allow fingerprint/Face ID login.

**Implementation:**
```bash
npm install capacitor-native-biometric
npx cap sync
```

---

### Task 4.3: Implement Deep Linking

**Purpose:** Allow links like `languagegems://game/vocab-master` to open specific content.

**Files:**
- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/Info.plist`
- `src/app/layout.tsx` (handle incoming links)

---

### Task 4.4: Add Offline Mode

**Files:**
- `public/sw.js` (Service Worker)
- `src/lib/offline/OfflineStorage.ts` (CREATE)

**What to cache:**
- User profile and preferences
- Recently accessed vocabulary
- Game assets (images, sounds)
- Last session data

---

## File Reference

### Files to CREATE

| File | Purpose |
|------|---------|
| `src/app/mobile-profile/page.tsx` | Mobile profile page |
| `src/app/mobile-progress/page.tsx` | Mobile progress/stats page |
| `src/app/mobile-teacher-home/page.tsx` | Teacher dashboard for mobile |
| `src/components/capacitor/MobileHeader.tsx` | Native-style header |
| `src/components/capacitor/MobileAuthGate.tsx` | Central auth handling |
| `src/components/capacitor/MobilePageWrapper.tsx` | Per-page layout wrapper |
| `src/components/capacitor/MobileSplashScreen.tsx` | Animated splash screen |
| `src/components/capacitor/PageTransition.tsx` | Page transition animations |
| `src/components/capacitor/MobileSkeletons.tsx` | Loading skeletons |
| `src/components/capacitor/PullToRefresh.tsx` | Pull-to-refresh component |

### Files to MODIFY

| File | Changes |
|------|---------|
| `src/components/capacitor/MobileTabBar.tsx` | Add role-aware navigation |
| `src/components/capacitor/index.ts` | Export new components |
| `src/app/layout.tsx` | Add MobileAuthGate |
| `src/app/components/ClientLayout.tsx` | Hide web elements in native mode |
| `src/app/globals.css` | Add mobile-specific styles |
| `capacitor.config.ts` | Update for production |

---

## Testing Checklist

### Navigation Tests
- [ ] Student can navigate using tab bar on all pages
- [ ] Teacher can navigate using tab bar on all pages
- [ ] Tab bar remains visible on all content pages
- [ ] Active tab highlights correctly
- [ ] Back navigation works properly

### Authentication Tests
- [ ] User logs in once and stays logged in
- [ ] Session persists after app restart
- [ ] Games page doesn't redirect to login
- [ ] Logout works correctly
- [ ] Login redirects to appropriate home (teacher/student)

### Visual Tests
- [ ] No web navigation visible in native app
- [ ] No footer visible in native app
- [ ] Content doesn't go under tab bar
- [ ] Safe areas respected on notched devices
- [ ] Dark theme consistent across all pages

### Platform-Specific Tests
- [ ] iOS: Slide transitions work
- [ ] iOS: Haptic feedback works
- [ ] Android: Fade transitions work
- [ ] Android: Back button handled correctly

### Device Tests
- [ ] iPhone with notch
- [ ] iPhone with Dynamic Island
- [ ] iPhone SE (small screen)
- [ ] Android various screen sizes
- [ ] iPad (optional)

---

## Implementation Order

1. **CRITICAL - Fix Navigation (Do First)**
   - Update MobileTabBar routes
   - Create mobile-profile page
   - Create mobile-progress page

2. **CRITICAL - Fix Auth (Do Second)**
   - Create MobileAuthGate
   - Remove auth redirects from games

3. **IMPORTANT - Hide Web Elements (Do Third)**
   - Update ClientLayout
   - Wrap nav/footer in WebOnly

4. **POLISH - Visual Improvements (Do Fourth)**
   - Create MobilePageWrapper
   - Add consistent styling
   - Create teacher home

5. **ENHANCE - Native Features (Do Last)**
   - Push notifications
   - Deep linking
   - Offline mode

---

## Commands Reference

```bash
# Development
npm run dev                    # Start Next.js dev server

# Capacitor
npm run cap:sync              # Sync web code to native projects
npm run cap:ios               # Open iOS project in Xcode
npm run cap:android           # Open Android project in Android Studio

# Build for production
npm run build                 # Build Next.js
npx cap copy                  # Copy build to native projects
```

---

*Document maintained by the Language Gems development team.*
*Last updated: January 17, 2026*
