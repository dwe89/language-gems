# Production Worksheet Generation - Diagnostic & Fix Summary

## Changes Made

### 1. **Enhanced Error Logging** ✅
Added comprehensive error tracking to catch production-only issues:

#### `/src/app/api/worksheets/generate/route.ts`
- Added request timing (`startTime`)
- Added detailed error logging with stack traces
- Included duration metrics in error responses
- Log timestamp for production debugging

#### `/src/app/api/worksheets/generate-html/route.ts`
- Added request timing for all generators
- Added `generationTime` to all responses
- Enhanced error details with worksheet context
- Better stack trace logging

### 2. **Production Diagnostic Tool** ✅
Created `/scripts/debug-production-worksheet-generation.js`

**Run it with:**
```bash
npm run debug:worksheet-production
```

**What it checks:**
- ✅ Environment variables (OPENAI_API_KEY, Supabase credentials)
- ✅ Node.js version compatibility
- ✅ OpenAI API connectivity
- ✅ Supabase connectivity
- ✅ JSON stringification/parsing (production data format)
- ✅ Memory usage (Vercel limits)
- ✅ Timeout scenarios
- ✅ Production dependencies

### 3. **JSON Parsing Safeguards** (Already Existed)
The code already handles stringified `rawContent` from production DB:
- Lines 53-74 in `generate-html/route.ts`
- Automatically parses stringified JSON from Postgres
- Logs when parsing occurs

## Most Likely Production Issues

### **Top Suspects:**

1. **⚠️ Environment Variables Not Set in Vercel**
   - Missing `OPENAI_API_KEY`
   - Missing Supabase credentials
   - **Fix:** Check Vercel Dashboard → Settings → Environment Variables

2. **⚠️ Timeout (60s may be insufficient)**
   - Complex worksheets (word search, crossword) can take 30-45s
   - Add OpenAI API latency: +10-20s
   - **Fix:** Increase `maxDuration` to 120s in both routes

3. **⚠️ Memory Limits**
   - Word search generation is memory-intensive
   - Vercel default: 1024MB
   - **Fix:** Upgrade Vercel plan if hitting limits

4. **⚠️ Cold Start Delays**
   - Serverless functions "wake up" slowly
   - First request after idle can timeout
   - **Fix:** Consider keeping functions warm or increase maxDuration

## How to Debug Production Issues

### Step 1: Check Vercel Logs
```bash
# View recent logs
vercel logs [your-deployment-url]

# Stream live logs
vercel logs [your-deployment-url] --follow
```

**Look for:**
- `[WORKSHEET GEN]` - Worksheet generation start/errors
- `[HTML API]` - HTML generation errors
- `Duration:` - Check if hitting 60s timeout
- Error stack traces

### Step 2: Test Locally in Production Mode
```bash
# Build for production
npm run build

# Start production server
npm start

# Test worksheet generation
# (Go to localhost:3000 and create a worksheet)
```

### Step 3: Check Environment Variables
In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Verify all required variables are set:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Monitor Generation Times
With the new timing logs, you'll see:
```
✅ [HTML API] Vocabulary practice HTML generated, length: 45230 in 2345ms
```

If times are consistently > 50s, increase `maxDuration`:

**In both files:**
- `/src/app/api/worksheets/generate/route.ts`
- `/src/app/api/worksheets/generate-html/route.ts`

Change:
```typescript
export const maxDuration = 60; // 60 seconds
```

To:
```typescript
export const maxDuration = 120; // 120 seconds (2 minutes)
```

### Step 5: Check for Specific Error Patterns

**Common Production Errors:**

1. **"Cannot find module 'openai'"**
   - Dependencies not installed in production
   - **Fix:** Ensure `openai` is in `dependencies` not `devDependencies`

2. **"rawContent is not iterable" or "Cannot read property of undefined"**
   - `rawContent` is stringified in production
   - **Fix:** Already handled in code (lines 53-74), check logs to confirm parsing

3. **"Request timeout"**
   - Function exceeded 60s limit
   - **Fix:** Increase `maxDuration` to 120s

4. **"Out of memory"**
   - Word search/crossword generation too large
   - **Fix:** Upgrade Vercel plan or optimize generators

## Next Steps

### Immediate Actions:

1. **Deploy with Enhanced Logging**
   ```bash
   git add .
   git commit -m "Add production worksheet generation diagnostics"
   git push
   ```

2. **Monitor Vercel Deployment Logs**
   - Watch for new error details
   - Check generation times
   - Look for JSON parsing warnings

3. **Test a Worksheet in Production**
   - Try creating a simple vocabulary worksheet
   - Check logs for timing and errors
   - Gradually test more complex templates

### If Issues Persist:

1. **Increase Timeout**
   ```typescript
   export const maxDuration = 120; // Double the timeout
   ```

2. **Add Retry Logic**
   - Modify generators to retry on timeout
   - Add exponential backoff for OpenAI calls

3. **Optimize Generators**
   - Cache word search results
   - Reduce AI prompt complexity
   - Split large worksheets into smaller chunks

4. **Monitor Performance**
   - Use new timing metrics
   - Track which templates timeout
   - Identify slow API calls

## Quick Reference

### Debug Commands
```bash
# Run diagnostic tool
npm run debug:worksheet-production

# Build and test locally
npm run build && npm start

# View Vercel logs
vercel logs [url] --follow
```

### Key Files Modified
- ✅ `/src/app/api/worksheets/generate/route.ts` - Enhanced error logging
- ✅ `/src/app/api/worksheets/generate-html/route.ts` - Added timing metrics
- ✅ `/scripts/debug-production-worksheet-generation.js` - New diagnostic tool
- ✅ `/package.json` - Added `debug:worksheet-production` script

### Monitoring Points
All responses now include:
- `generationTime` - How long HTML generation took
- `duration` - How long the entire request took
- Detailed error context in logs

## Expected Behavior

**Localhost (Working):**
```
[WORKSHEET GEN] Request started at 2025-11-14T...
[HTML API] POST request received at 2025-11-14T...
✅ [HTML API] Vocabulary practice HTML generated, length: 45230 in 2345ms
```

**Production (Should Now Work):**
```
[WORKSHEET GEN] Request started at 2025-11-14T...
📌 [HTML API] Normalizing: worksheet.rawContent is a string (stringified JSON). Attempting to JSON.parse it...
📌 [HTML API] Successfully parsed worksheet.rawContent to object
✅ [HTML API] Vocabulary practice HTML generated, length: 45230 in 3567ms
```

## Success Criteria

- ✅ Worksheet generation completes in < 60s (or 120s with increased limit)
- ✅ No JSON parsing errors in logs
- ✅ Environment variables all present
- ✅ Memory usage < 80% of limit
- ✅ Error logs include full context and stack traces

---

**You're now set up to:**
1. Diagnose production issues with the diagnostic tool
2. Monitor generation performance with timing metrics
3. Debug errors with enhanced logging
4. Quickly identify and fix production-only problems

**Deploy and test!** 🚀
