# Vercel Function Size Fix - Implementation Summary

## Problem
The `api/worksheets/generate-html` serverless function was **433.69 MB**, exceeding Vercel's 300 MB limit, causing deployment failures.

## Root Causes Identified

1. **Puppeteer bundling** (~100+ MB): Even though not directly imported, Next.js was including it in the bundle
2. **Heavy dependencies in same workspace**: AWS SDK, Google Cloud TTS, Sharp, etc.
3. **OpenAI SDK eager loading** (~30-50 MB): Imported at module level in vocabulary-practice.ts
4. **Lack of output file tracing configuration**: All node_modules being included by default

## Solutions Implemented

### 1. Output File Tracing Configuration (`next.config.js`)
```javascript
outputFileTracingIncludes: {
  '/api/worksheets/generate-html': [
    // Only include what we need
    './src/app/api/worksheets/generate-html/**/*',
    './src/utils/wordSearchGenerator.ts',
    './node_modules/@blex41/word-search/**/*',
  ],
},
outputFileTracingExcludes: {
  '/api/worksheets/generate-html': [
    // Explicitly exclude heavy packages
    './node_modules/puppeteer/**/*',
    './node_modules/puppeteer-core/**/*',
    './node_modules/@sparticuz/**/*',
    './node_modules/chromium-bidi/**/*',
    './node_modules/sharp/**/*',
    './node_modules/@aws-sdk/**/*',
    './node_modules/@google-cloud/**/*',
  ],
},
```

**Impact**: Reduces bundle by ~150-200 MB by excluding unnecessary dependencies.

### 2. Webpack Externals for Puppeteer (`next.config.js`)
```javascript
if (isServer) {
  config.externals = config.externals || [];
  if (Array.isArray(config.externals)) {
    config.externals.push({
      'puppeteer': 'commonjs puppeteer',
      'puppeteer-core': 'commonjs puppeteer-core',
      '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
    });
  }
}
```

**Impact**: Prevents Puppeteer from being bundled into serverless functions.

### 3. Lazy Load OpenAI SDK (`vocabulary-practice.ts`)
**Before:**
```typescript
import OpenAI from 'openai';
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

**After:**
```typescript
let openaiClient: any = null;
async function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = (await import('openai')).default;
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}
```

**Impact**: Reduces initial bundle size by ~30-50 MB through code splitting.

### 4. Route-Level Runtime Configuration (`route.ts`)
```typescript
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
```

**Impact**: Optimizes serverless function configuration.

### 5. Vercel Function Configuration (`vercel.json`)
```json
{
  "functions": {
    "api/worksheets/generate-html.func/**": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

**Impact**: Allocates appropriate resources for the function.

## Expected Results

### Bundle Size Reduction
- **Before**: 433.69 MB
- **After**: ~100-150 MB (estimated)
- **Target**: < 300 MB (Vercel limit)

### Performance Impact
- **Minimal latency increase**: OpenAI lazy loading adds ~50-100ms only when crossword generation is used
- **Memory efficiency**: Better memory utilization with code splitting
- **Cold start**: Slightly improved due to smaller bundle

## Files Modified

1. **next.config.js**: Added output file tracing and webpack externals
2. **vercel.json**: Added function-specific configuration
3. **src/app/api/worksheets/generate-html/route.ts**: Added runtime exports
4. **src/app/api/worksheets/generate-html/generators/vocabulary-practice.ts**: Lazy load OpenAI

## Deployment Steps

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Fix: Reduce serverless function bundle size for worksheet generation"
   git push
   ```

2. Monitor Vercel deployment logs for bundle size confirmation

3. Verify the function deploys successfully without size errors

4. Test worksheet generation functionality:
   - Reading comprehension worksheets
   - Vocabulary practice worksheets
   - Crossword generation (with OpenAI clues)
   - Word search generation

## Fallback Options (If Still Over Limit)

If the bundle is still too large after these optimizations:

### Option A: Split into Multiple Routes
- `/api/worksheets/generate-html/reading` - Reading comprehension only
- `/api/worksheets/generate-html/vocabulary` - Vocabulary practice only
- `/api/worksheets/generate-html/crossword` - Crossword generation only

### Option B: Move to Edge Runtime
```typescript
export const runtime = 'edge';
```
Note: Edge runtime has limitations (no Node.js APIs, smaller package support).

### Option C: External Service
- Move heavy processing to a separate microservice
- Use Vercel Background Functions for non-time-critical operations

## Monitoring

After deployment, monitor:
- Bundle size in Vercel build logs
- Cold start times for the function
- Error rates in Sentry
- User-reported issues with worksheet generation

## Additional Notes

- The OpenAI lazy loading is backwards compatible - no API changes needed
- Puppeteer exclusion is safe since it's only used in `/api/worksheets/generate-pdf`
- AWS SDK and Google Cloud TTS are excluded since they're not used in HTML generation
- Output file tracing is Next.js 13.5+ feature - ensure version compatibility

## Success Criteria

✅ Deployment completes without "exceeds maximum size limit" errors  
✅ All worksheet types generate correctly  
✅ No increase in error rates  
✅ Cold start times remain acceptable (< 5 seconds)  
✅ Crossword AI clue generation still works

---

**Date**: October 24, 2025  
**Status**: Implemented, awaiting deployment verification
