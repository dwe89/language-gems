# Feature Flags System

This document explains how the feature flag system works in LanguageGems to control which features are available in different environments.

## Overview

The feature flag system allows you to:
- **Development**: All features work normally for development/testing
- **Production**: Only Blog and Shop are active, other features show "Coming Soon"

## Configuration

### Current Feature Status

| Feature | Development | Production | Status |
|---------|------------|------------|---------|
| Blog | ✅ Active | ✅ Active | Ready for launch |
| Shop | ✅ Active | ✅ Active | Ready for launch |
| Games | ✅ Active | 🚧 Coming Soon | In development |
| Custom Lessons | ✅ Active | 🚧 Coming Soon | In development |
| Progress Tracking | ✅ Active | 🚧 Coming Soon | In development |

## How It Works

### 1. Feature Flag Configuration (`src/lib/featureFlags.ts`)

```typescript
export const featureFlags: FeatureFlags = {
  // Always enabled features
  blog: true,
  shop: true,
  auth: true,
  
  // Development vs Production feature flags
  games: isDevelopment, // Only in development
  customLessons: isDevelopment, // Only in development  
  progressTracking: isDevelopment, // Only in development
};
```

### 2. Navigation Integration

The navigation automatically shows:
- **Enabled features**: Normal links
- **Disabled features**: Links with "Soon" badge that go to coming-soon page

### 3. Middleware Protection

The middleware automatically redirects users trying to access disabled features to the coming-soon page.

### 4. Coming Soon Page

Disabled features redirect to `/coming-soon?feature=FeatureName` with:
- Beautiful animated UI
- Feature-specific descriptions
- Links to active features (Blog & Shop)

## Testing

### In Development (localhost)
```bash
npm run dev
```
- All features work normally
- Full functionality available for testing

### Simulating Production
To test production behavior locally:

1. Set NODE_ENV to production:
```bash
NODE_ENV=production npm run dev
```

2. Or modify `src/lib/featureFlags.ts` temporarily:
```typescript
// Force production behavior for testing
export const featureFlags: FeatureFlags = {
  blog: true,
  shop: true,
  auth: true,
  games: false, // This will show "Coming Soon"
  customLessons: false,
  progressTracking: false,
};
```

## Deployment

### Production Deployment
When deployed to production (Vercel, Netlify, etc.):
- `NODE_ENV` is automatically set to `production`
- Only Blog and Shop will be accessible
- Other features automatically show "Coming Soon"

### No Additional Configuration Needed
The system automatically detects the environment and applies the appropriate feature flags.

## Adding New Features

To add a new feature to the system:

1. Add to `FeatureFlags` interface in `src/lib/featureFlags.ts`
2. Add the feature flag logic
3. Update `getNavigationItems()` function
4. Add route protection in middleware if needed
5. Update this documentation

## Customization

You can customize the behavior by:
- Modifying feature flags in `src/lib/featureFlags.ts`
- Updating the Coming Soon component styling
- Adding environment-specific configuration
- Creating different feature sets for different user roles

## Benefits

✅ **Safe Deployment**: Deploy incomplete features without exposing them
✅ **Development Flexibility**: Full functionality available for development
✅ **User Experience**: Professional "Coming Soon" pages instead of broken links
✅ **Marketing Ready**: Active features (Blog & Shop) available immediately
✅ **Easy Management**: Single configuration file controls all features 