# Native UI/UX Testing Guide

This guide outlines how to test the platform-specific UI/UX improvements on actual Android and iOS devices.

## Prerequisites

### Device Setup
- [ ] Android device (API 23+ / Android 6.0+)
- [ ] iOS device (iOS 13+)
- [ ] Capacitor app built and installed
- [ ] Developer tools connected (ADB for Android, Safari Web Inspector for iOS)

### Building the Capacitor App

```bash
# Build for iOS
npx cap build ios

# Build for Android
npx cap build android

# Run on connected device
npx cap run ios
npx cap run android
```

## Testing Checklist by Component

### 1. Safe Areas (EnhancedSafeAreaWrapper)

**iOS Tests:**
- [ ] Content not covered by notch/Dynamic Island
- [ ] Content not covered by home indicator
- [ ] Safe areas adjust correctly on device rotation
- [ ] Status bar area properly handled

**Android Tests:**
- [ ] Content not covered by status bar
- [ ] Content not covered by navigation bar
- [ ] Safe areas adjust correctly on device rotation
- [ ] Bottom gestures area not obscured

**Test Scenarios:**
- Open any page and verify content is visible
- Rotate device and check content positioning
- Scroll to bottom and verify no content hidden

### 2. Platform Navigation (PlatformTabBar, TopNavBar)

**iOS Bottom Tab Bar:**
- [ ] Translucent blur effect visible
- [ ] Active tab has blue accent color
- [ ] Rounded corners on active tab
- [ ] Icons have proper stroke width (2.5 when active)
- [ ] Haptic feedback on tab tap
- [ ] Safe area bottom padding applied

**Android Bottom Tab Bar:**
- [ ] Material elevation shadow visible
- [ ] Indigo accent color on active tab
- [ ] Active indicator centered below icon
- [ ] Icons have proper stroke width (2.5 when active)
- [ ] Haptic feedback on tab tap
- [ ] Surface elevation applied

**iOS Top Nav Bar:**
- [ ] Large title style
- [ ] Back button with iOS-style chevron
- [ ] Translucent blur effect
- [ ] Haptic feedback on button tap
- [ ] Safe area top padding applied

**Android Top Nav Bar:**
- [ ] Material elevation shadow
- [ ] Back button with Material-style arrow
- [ ] Action button with haptic feedback
- [ ] Surface elevation applied

**Test Scenarios:**
- Tap each tab and verify navigation
- Tap back button and verify navigation
- Check active state styling
- Verify haptic feedback on each tap

### 3. Platform Touch Feedback (PlatformButton, PlatformCard)

**iOS Touch Feedback:**
- [ ] Native press animation (scale 0.95 on tap)
- [ ] Haptic feedback on button press
- [ ] Smooth animation transitions
- [ ] Blue primary buttons
- [ ] Gray secondary buttons

**Android Touch Feedback:**
- [ ] Material ripple effect visible on tap
- [ ] Ripple originates from touch point
- [ ] Haptic feedback on button press
- [ ] Indigo primary buttons
- [ ] Gray secondary buttons
- [ ] Surface elevation on cards

**Test Scenarios:**
- Tap buttons and verify animations
- Long-press buttons and verify no unexpected behavior
- Check disabled button state

### 4. Status Bar Theming (useStatusBarTheming)

**iOS Tests:**
- [ ] Light mode status bar visible on light pages
- [ ] Dark mode status bar visible on dark pages
- [ ] Transparent overlay working
- [ ] Status bar color updates on route change

**Android Tests:**
- [ ] Light mode status bar color on light pages (#ffffff)
- [ ] Dark mode status bar color on dark pages (#1a1a2e)
- [ ] Status bar color updates on route change

**Test Scenarios:**
- Navigate between light and dark pages
- Verify status bar contrast
- Check status bar updates in real-time

### 5. Page Transitions

**iOS Tests:**
- [ ] Slide-in from right for new pages
- [ ] Slide-out to left for back navigation
- [ ] Cubic-bezier timing function (0.32, 0.72, 0, 1)
- [ ] Reduced motion mode disables animations

**Android Tests:**
- [ ] Fade-in for page transitions
- [ ] Linear timing function
- [ ] Reduced motion mode disables animations

**Test Scenarios:**
- Navigate between pages
- Enable reduced motion and verify no animations
- Test with different device performance levels

### 6. Platform Typography (usePlatformTypography)

**iOS Typography:**
- [ ] SF System font family used
- [ ] Apple's font scale applied correctly
- [ ] Accessibility font scaling works
- [ ] Letter spacing: 0 (iOS style)

**Android Typography:**
- [ ] Roboto/Noto Sans font family used
- [ ] Material Design scale applied correctly
- [ ] Accessibility font scaling works
- [ ] Letter spacing: 0.01em (Material style)

**Web Typography:**
- [ ] System font stack fallback
- [ ] Responsive scaling

**Test Scenarios:**
- Check font rendering on different text sizes
- Enable accessibility scaling and verify
- Test with different languages

### 7. Platform Icons (PlatformIcon)

**iOS Icons:**
- [ ] Stroke width: 2 (standard), 2.5 (active)
- [ ] Round line caps
- [ ] SF Symbols style appearance
- [ ] Blue accent color (iOS)

**Android Icons:**
- [ ] Stroke width: 2.5 (standard), 3 (active)
- [ ] Round line caps
- [ ] Material Design style appearance
- [ ] Indigo accent color (Android)

**Test Scenarios:**
- Verify icons render correctly
- Check stroke width consistency
- Test active/inactive states

### 8. Platform Modals (PlatformModal, PlatformAlertDialog)

**iOS Modals:**
- [ ] Backdrop blur (8px) visible
- [ ] Slide-up animation
- [ ] Scale-in icon animation for alerts
- [ ] iOS-style button colors

**Android Modals:**
- [ ] Solid backdrop (0.6 opacity)
- [ ] Fade-in animation
- [ ] Material-style layout
- [ ] Material-style button colors

**Test Scenarios:**
- Open centered modal and verify animations
- Open bottom sheet and verify slide-up
- Tap backdrop and verify modal closes
- Check alert dialog styles

### 9. Platform Colors (usePlatformColors)

**iOS Color Palette:**
- [ ] Primary: #007AFF (iOS Blue)
- [ ] Secondary: #F2F2F7 (iOS Gray)
- [ ] Success: #34C759 (iOS Green)
- [ ] Warning: #FF9500 (iOS Orange)
- [ ] Error: #FF3B30 (iOS Red)

**Android Color Palette:**
- [ ] Primary: #6200EE (Material Purple)
- [ ] Secondary: #E1E1E1 (Material Gray)
- [ ] Success: #4CAF50 (Material Green)
- [ ] Warning: #FF9800 (Material Orange)
- [ ] Error: #F44336 (Material Red)

**Test Scenarios:**
- Verify color accuracy
- Test dark mode color adjustments
- Check color contrast ratios

### 10. Platform Gestures (SwipeNavigation, LongPressButton)

**Swipe Navigation:**
- [ ] Swipe right triggers back navigation
- [ ] Haptic feedback on swipe
- [ ] Back indicator shows on swipe gesture
- [ ] Swipe threshold works correctly (50px)
- [ ] Swipe disabled when not native app

**Long Press:**
- [ ] Long press triggers after 500ms threshold
- [ ] Visual feedback during long press
- [ ] Haptic feedback on long press complete
- [ ] Cancel if moved >10px from start
- [ ] Regular tap still works

**Swipeable Cards:**
- [ ] Swipe left shows left action button
- [ ] Swipe right shows right action button
- [ ] Card follows finger during swipe
- [ ] Snap back if not swiped far enough
- [ ] Trigger action on 70% threshold

**Test Scenarios:**
- Test swipe navigation on different pages
- Long press various buttons
- Swipe cards in different directions

### 11. Haptic Feedback

**Haptic Types:**
- [ ] Light impact (subtle taps)
- [ ] Medium impact (standard buttons)
- [ ] Heavy impact (confirmations)
- [ ] Success notification (completed actions)
- [ ] Warning notification (alerts)
- [ ] Error notification (errors)

**Test Scenarios:**
- Tap various buttons and verify haptic intensity
- Test haptic on navigation
- Verify haptic on modal actions

### 12. Accessibility (useAccessibility, AccessibleComponents)

**VoiceOver (iOS):**
- [ ] ARIA labels read correctly
- [ ] Live regions announce changes
- [ ] Focus management works
- [ ] Focus trap in modals

**TalkBack (Android):**
- [ ] ARIA labels read correctly
- [ ] Live regions announce changes
- [ ] Focus management works
- [ ] Focus trap in modals

**Reduced Motion:**
- [ ] Animations disabled when reduced motion enabled
- [ ] Layout still functional without animations

**High Contrast:**
- [ ] High contrast mode detected
- [ ] Colors adjust for high contrast

**Test Scenarios:**
- Enable VoiceOver/TalkBack and navigate app
- Enable reduced motion and verify no animations
- Test high contrast mode

## Performance Testing

### Memory Usage
- [ ] Monitor memory with DevTools
- [ ] Check for memory leaks
- [ ] Verify efficient component re-renders

### Animation Performance
- [ ] Check FPS during transitions
- [ ] Verify smooth scrolling
- [ ] Test on low-end devices

### Load Times
- [ ] Measure initial page load
- [ ] Check lazy loading works
- [ ] Verify code splitting reduces bundle size

## Issue Tracking Template

```
Component: [Component Name]
Platform: [iOS/Android]
Issue: [Description]
Steps to Reproduce:
1.
2.
3.

Expected Behavior: [What should happen]
Actual Behavior: [What actually happens]
Screenshot/Video: [Optional]
```

## Success Criteria

A component is considered complete when:
- [ ] All iOS tests pass
- [ ] All Android tests pass
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Accessibility requirements met
