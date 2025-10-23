# Noughts and Crosses Chunk Loading Fix

## Problem
Users on Windows PCs were experiencing `ChunkLoadError` with 403 (Forbidden) status when trying to load the Noughts and Crosses game, while Mac users had no issues. The error message showed:

```
ChunkLoadError: Loading chunk 39121 failed.
(error: https://www.languagegems.com/_next/static/chunks/39121-2744a0fa51a74523.js)
```

This is a common issue with Next.js deployments where:
- Browser caches old HTML that references chunks from previous builds
- CDN/edge caching serves stale content with outdated chunk references
- Webpack chunks are renamed on each deployment but old HTML still references them
- Different platforms (Windows vs Mac) have different caching behaviors

## Solution Implemented

We've implemented a **three-layer defense** against chunk loading errors:

### 1. Webpack Chunk Retry Logic (`scripts/chunk-retry.js`)

**What it does:**
- Automatically retries failed chunk loads up to 3 times with exponential backoff
- Clears service worker caches if retries fail
- Forces a page reload from server (bypassing cache) as last resort
- Tracks reload attempts to prevent infinite loops

**How it works:**
- Injected into the webpack bundle via `next.config.js`
- Intercepts webpack's chunk loading function
- Retries on 403, 404, or network errors
- Session storage prevents multiple reload attempts

### 2. React Error Boundary (`src/components/errors/ChunkLoadErrorBoundary.tsx`)

**What it does:**
- Catches ChunkLoadError exceptions that bubble up to React
- Provides user-friendly UI when errors occur
- Offers manual reload and cache clearing options
- Auto-reloads after 1.5 seconds on first error

**Features:**
- Detects chunk errors specifically vs generic errors
- Prevents infinite reload loops via session storage
- Clears service worker and cache storage
- Beautiful UI matching Language Gems design system

### 3. Cache Headers (`vercel.json`)

**What it does:**
- Sets proper cache headers for static chunks (immutable, 1 year)
- Forces revalidation for game pages (no cache)
- Prevents stale HTML from referencing old chunks

**Headers configured:**
```json
{
  "/_next/static/(.*)": "public, max-age=31536000, immutable",
  "/games/(.*)": "public, max-age=0, must-revalidate"
}
```

## Files Changed

1. **next.config.js**
   - Added webpack entry point injection for chunk-retry.js

2. **scripts/chunk-retry.js** (NEW)
   - Low-level chunk loading interceptor
   - Retry logic with exponential backoff
   - Auto-reload on persistent failures

3. **src/components/errors/ChunkLoadErrorBoundary.tsx** (NEW)
   - React error boundary for chunk errors
   - User-friendly error UI
   - Manual and automatic recovery options

4. **src/app/games/noughts-and-crosses/page.tsx**
   - Wrapped component with ChunkLoadErrorBoundary
   - Changed to named function export

5. **vercel.json**
   - Added cache control headers
   - Static chunks: immutable, 1 year cache
   - Game pages: force revalidation

## Testing Instructions

### Before Deploying

1. **Local Testing:**
   ```bash
   npm run build
   npm start
   ```
   - Open browser DevTools > Network tab
   - Throttle network to "Slow 3G"
   - Navigate to `/games/noughts-and-crosses`
   - Check console for chunk retry logs

2. **Simulate Chunk Error:**
   - In DevTools > Network, block a chunk file pattern: `*39121*.js`
   - Navigate to noughts and crosses
   - Should see retry attempts in console
   - Should auto-reload after retries fail

### After Deploying to Vercel

1. **Clear Browser Cache:**
   ```
   Windows: Ctrl + Shift + Delete
   Mac: Cmd + Shift + Delete
   ```
   - Clear "Cached images and files"
   - Clear "Cookies and site data"

2. **Test on Windows PC:**
   - Open in Chrome (Windows)
   - Navigate to: `https://www.languagegems.com/games/noughts-and-crosses`
   - Check console for:
     - `[ChunkRetry] Chunk loading retry handler installed`
     - No chunk load errors
   - Play a game to ensure full functionality

3. **Test Cache Headers:**
   - Open DevTools > Network tab
   - Refresh page
   - Check response headers for `/_next/static/chunks/*`:
     - Should have: `Cache-Control: public, max-age=31536000, immutable`
   - Check response headers for `/games/noughts-and-crosses`:
     - Should have: `Cache-Control: public, max-age=0, must-revalidate`

4. **Test Error Boundary:**
   - Open browser console
   - Run: `sessionStorage.clear(); throw new Error('ChunkLoadError: test');`
   - Should see the error boundary UI
   - Click "Reload Page" should work
   - Click "Clear Cache & Reload" should clear caches

### Testing Checklist

- [ ] Local build completes successfully
- [ ] No TypeScript errors in error boundary component
- [ ] Chunk retry script loads in browser
- [ ] Game works on Mac (regression test)
- [ ] Game works on Windows PC (primary fix)
- [ ] Error boundary displays on simulated error
- [ ] Cache headers are correct in production
- [ ] No infinite reload loops occur
- [ ] Assignment mode still works
- [ ] Theme selection still works

## Deployment Steps

1. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Fix: Add chunk loading retry and error boundary for Windows PC chunk errors"
   ```

2. **Push to Main:**
   ```bash
   git push origin main
   ```

3. **Vercel Auto-Deploy:**
   - Wait for Vercel deployment to complete
   - Check build logs for any errors
   - Verify deployment URL in Vercel dashboard

4. **Post-Deployment Verification:**
   - Test on Windows PC immediately after deployment
   - Monitor Sentry for any new errors
   - Check Vercel analytics for error rates

## Monitoring

### What to Watch

1. **Sentry Errors:**
   - Look for reduced `ChunkLoadError` incidents
   - Check if error boundary is catching errors properly
   - Monitor for any new error types introduced

2. **Console Logs:**
   - `[ChunkRetry]` logs indicate retry logic is working
   - `[ChunkLoadErrorBoundary]` logs show boundary is active
   - Look for reload loop warnings

3. **User Reports:**
   - Windows PC users should no longer see chunk errors
   - Game should load reliably across all platforms

### Success Metrics

- **Before Fix:** ChunkLoadError on Windows PCs ~100% of the time
- **After Fix:** ChunkLoadError on any platform < 1%
- **Auto-recovery:** 95%+ of chunk errors should auto-resolve via retry or reload

## Rollback Plan

If the fix causes issues:

1. **Revert next.config.js:**
   ```bash
   git revert <commit-hash>
   ```

2. **Remove chunk-retry.js injection:**
   - Comment out entry point modification in webpack config

3. **Keep error boundary:**
   - The error boundary is harmless and provides better UX even without retry

## Additional Notes

### Why This Happens

- **Deployment timing:** New builds invalidate old chunks
- **CDN propagation:** Edge servers update at different times
- **Browser caching:** Aggressive caching of HTML files
- **Platform differences:** Windows and Mac handle cache differently

### Long-term Prevention

1. **Use Vercel's `cleanUrls`:**
   - Consider enabling for more consistent URLs

2. **Service Worker Strategy:**
   - If implementing PWA, use cache-first for chunks
   - Always revalidate HTML pages

3. **Build IDs:**
   - Next.js already uses build IDs in chunk names
   - This fix handles the edge cases

### References

- [Next.js Chunk Loading Issues](https://nextjs.org/docs/messages/chunk-load-error)
- [Webpack Chunk Loading](https://webpack.js.org/guides/code-splitting/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Vercel Cache Headers](https://vercel.com/docs/edge-network/caching)

## Support

If users still experience issues after this fix:

1. Ask them to clear browser cache completely
2. Try incognito/private browsing mode
3. Check if they're using a VPN or corporate proxy
4. Verify they're on the latest deployment
5. Check Sentry for specific error details
