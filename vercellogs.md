16:39:42.104 Running build in Washington, D.C., USA (East) – iad1
16:39:42.105 Build machine configuration: 4 cores, 8 GB
16:39:42.235 Cloning github.com/dwe89/language-gems (Branch: main, Commit: 263fca9)
16:39:53.816 Warning: Failed to fetch one or more git submodules
16:39:53.817 Cloning completed: 11.582s
16:39:54.439 Restored build cache from previous deployment (HYRgDcnD3ZixCgSbjEmfaK7fTMYV)
16:39:54.859 Running "vercel build"
16:39:55.673 Vercel CLI 50.4.4
16:39:56.287 Running "install" command: `npm install`...
16:40:06.508 
16:40:06.508 added 72 packages, and audited 1464 packages in 10s
16:40:06.508 
16:40:06.508 343 packages are looking for funding
16:40:06.508   run `npm fund` for details
16:40:06.623 
16:40:06.623 23 vulnerabilities (2 low, 7 moderate, 13 high, 1 critical)
16:40:06.623 
16:40:06.623 To address issues that do not require attention, run:
16:40:06.623   npm audit fix
16:40:06.623 
16:40:06.623 To address all issues possible (including breaking changes), run:
16:40:06.623   npm audit fix --force
16:40:06.623 
16:40:06.623 Some issues need review, and may require choosing
16:40:06.623 a different dependency.
16:40:06.623 
16:40:06.624 Run `npm audit` for details.
16:40:06.667 Detected Next.js version: 14.2.31
16:40:06.667 Running "next build"
16:40:07.374   ▲ Next.js 14.2.31
16:40:07.375   - Experiments (use with caution):
16:40:07.375     · proxyTimeout
16:40:07.375 
16:40:07.483    Creating an optimized production build ...
16:42:30.603 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
16:43:40.378  ⚠ Compiled with warnings
16:43:40.379 
16:43:40.380 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.380 Critical dependency: the request of a dependency is an expression
16:43:40.380 
16:43:40.380 Import trace for requested module:
16:43:40.380 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.381 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
16:43:40.381 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
16:43:40.381 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/index.js
16:43:40.382 ./node_modules/@prisma/instrumentation/dist/index.js
16:43:40.382 ./node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js
16:43:40.382 ./node_modules/@sentry/node/build/cjs/index.js
16:43:40.382 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
16:43:40.382 ./src/app/global-error.tsx
16:43:40.383 
16:43:40.383 ./node_modules/require-in-the-middle/index.js
16:43:40.383 Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
16:43:40.383 
16:43:40.383 Import trace for requested module:
16:43:40.384 ./node_modules/require-in-the-middle/index.js
16:43:40.384 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.384 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
16:43:40.384 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
16:43:40.384 ./node_modules/@opentelemetry/instrumentation/build/esm/index.js
16:43:40.385 ./node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js
16:43:40.385 ./node_modules/@sentry/node/build/cjs/index.js
16:43:40.386 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
16:43:40.386 ./src/app/global-error.tsx
16:43:40.386 
16:43:40.386 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.386 Critical dependency: the request of a dependency is an expression
16:43:40.387 
16:43:40.387 Import trace for requested module:
16:43:40.387 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.387 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
16:43:40.387 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
16:43:40.387 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/index.js
16:43:40.387 ./node_modules/@prisma/instrumentation/dist/index.js
16:43:40.387 ./node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js
16:43:40.387 ./node_modules/@sentry/node/build/cjs/index.js
16:43:40.388 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
16:43:40.388 ./src/app/layout.tsx
16:43:40.388 
16:43:40.388 ./node_modules/require-in-the-middle/index.js
16:43:40.388 Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
16:43:40.388 
16:43:40.394 Import trace for requested module:
16:43:40.394 ./node_modules/require-in-the-middle/index.js
16:43:40.394 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
16:43:40.394 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
16:43:40.394 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
16:43:40.394 ./node_modules/@opentelemetry/instrumentation/build/esm/index.js
16:43:40.394 ./node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js
16:43:40.394 ./node_modules/@sentry/node/build/cjs/index.js
16:43:40.394 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
16:43:40.395 ./src/app/layout.tsx
16:43:40.395 
16:43:40.395 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
16:43:40.396 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
16:43:40.396 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
16:43:40.396 
16:43:40.396 Import trace for requested module:
16:43:40.396 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
16:43:40.396 ./node_modules/@supabase/realtime-js/dist/module/index.js
16:43:40.397 ./node_modules/@supabase/supabase-js/dist/module/index.js
16:43:40.397 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
16:43:40.397 ./node_modules/@supabase/ssr/dist/module/index.js
16:43:40.397 ./src/utils/supabase/middleware.ts
16:43:40.397 
16:43:40.397 ./node_modules/@supabase/supabase-js/dist/module/index.js
16:43:40.397 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
16:43:40.397 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
16:43:40.397 
16:43:40.397 Import trace for requested module:
16:43:40.397 ./node_modules/@supabase/supabase-js/dist/module/index.js
16:43:40.398 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
16:43:40.398 ./node_modules/@supabase/ssr/dist/module/index.js
16:43:40.398 ./src/utils/supabase/middleware.ts
16:43:40.398 
16:43:40.399    Skipping validation of types
16:43:40.401    Skipping linting
16:43:41.298    Collecting page data ...
16:43:44.102 (node:1010) NOTE: The AWS SDK for JavaScript (v2) is in maintenance mode.
16:43:44.103  SDK releases are limited to address critical bug fixes and security issues only.
16:43:44.103 
16:43:44.103 Please migrate your code to use AWS SDK for JavaScript (v3).
16:43:44.103 For more information, check the blog post at https://a.co/cUPnyil
16:43:44.103 (Use `node --trace-warnings ...` to show where the warning was created)
16:43:44.258  ⚠ Using edge runtime on a page currently disables static generation for that page
16:43:44.340 [Progress] Supabase client initialized successfully
16:43:52.852    Generating static pages (0/810) ...
16:44:04.104 (node:1017) NOTE: The AWS SDK for JavaScript (v2) is in maintenance mode.
16:44:04.104  SDK releases are limited to address critical bug fixes and security issues only.
16:44:04.104 
16:44:04.105 Please migrate your code to use AWS SDK for JavaScript (v3).
16:44:04.105 For more information, check the blog post at https://a.co/cUPnyil
16:44:04.105 (Use `node --trace-warnings ...` to show where the warning was created)
16:44:04.542 🔍 Testing vocabulary query: {
16:44:04.543   language: 'es',
16:44:04.543   curriculumLevel: 'KS4',
16:44:04.543   examBoard: 'AQA',
16:44:04.543   tier: 'higher',
16:44:04.543   limit: 10,
16:44:04.543   randomize: false,
16:44:04.543   themeName: 'Popular culture',
16:44:04.543   unitName: 'Free time activities'
16:44:04.543 }
16:44:04.543 🔍 CentralizedVocabularyService: Converting language "es" -> "es"
16:44:05.455 🔍 [API] Creating server-side Supabase client...
16:44:05.455 🔍 [API] Fetching products from server...
16:44:07.617 Testing listening service...
16:44:07.618 🔍 [AQA LISTENING SERVICE] Fetching assessments for Level: foundation, Language: es
16:44:07.727 🔍 [API] Server response: { data: 1018, error: null }
16:44:07.727 ✅ [API] Successfully fetched 1018 products
16:44:07.818 ✅ [AQA LISTENING SERVICE] Found 2 assessments: [
16:44:07.818   {
16:44:07.818     id: '7461ad48-0ba5-4dde-90bf-bfe6786da792',
16:44:07.819     title: 'AQA Listening Assessment - Foundation Paper 1 (Spanish)',
16:44:07.819     description: 'Foundation level AQA-style Spanish listening assessment with audio generated by Gemini TTS',
16:44:07.819     level: 'foundation',
16:44:07.819     language: 'es',
16:44:07.820     identifier: 'paper-1',
16:44:07.820     version: '1.0',
16:44:07.820     total_questions: 8,
16:44:07.820     time_limit_minutes: 35,
16:44:07.820     created_by: null,
16:44:07.820     is_active: true,
16:44:07.820     created_at: '2025-07-29T21:35:20.611146+00:00',
16:44:07.821     updated_at: '2026-01-04T20:51:19.436+00:00'
16:44:07.821   },
16:44:07.821   {
16:44:07.821     id: '50d108f6-2fd2-4c8a-b03f-d16de43bd626',
16:44:07.821     title: 'AQA GCSE Spanish Listening - Foundation Tier - Paper 2',
16:44:07.821     description: 'Foundation level listening assessment covering Education, Technology, Town, and Holidays.',
16:44:07.821     level: 'foundation',
16:44:07.821     language: 'es',
16:44:07.821     identifier: 'paper-2',
16:44:07.821     version: '1.0',
16:44:07.821     total_questions: 8,
16:44:07.821     time_limit_minutes: 35,
16:44:07.821     created_by: null,
16:44:07.821     is_active: true,
16:44:07.821     created_at: '2026-01-04T21:20:33.701667+00:00',
16:44:07.822     updated_at: '2026-01-04T21:20:33.701667+00:00'
16:44:07.822   }
16:44:07.822 ]
16:44:07.822 Assessments found: [
16:44:07.822   {
16:44:07.822     id: '7461ad48-0ba5-4dde-90bf-bfe6786da792',
16:44:07.822     title: 'AQA Listening Assessment - Foundation Paper 1 (Spanish)',
16:44:07.822     description: 'Foundation level AQA-style Spanish listening assessment with audio generated by Gemini TTS',
16:44:07.822     level: 'foundation',
16:44:07.822     language: 'es',
16:44:07.822     identifier: 'paper-1',
16:44:07.822     version: '1.0',
16:44:07.822     total_questions: 8,
16:44:07.823     time_limit_minutes: 35,
16:44:07.823     created_by: null,
16:44:07.823     is_active: true,
16:44:07.823     created_at: '2025-07-29T21:35:20.611146+00:00',
16:44:07.823     updated_at: '2026-01-04T20:51:19.436+00:00'
16:44:07.823   },
16:44:07.823   {
16:44:07.823     id: '50d108f6-2fd2-4c8a-b03f-d16de43bd626',
16:44:07.823     title: 'AQA GCSE Spanish Listening - Foundation Tier - Paper 2',
16:44:07.823     description: 'Foundation level listening assessment covering Education, Technology, Town, and Holidays.',
16:44:07.823     level: 'foundation',
16:44:07.823     language: 'es',
16:44:07.823     identifier: 'paper-2',
16:44:07.823     version: '1.0',
16:44:07.823     total_questions: 8,
16:44:07.823     time_limit_minutes: 35,
16:44:07.823     created_by: null,
16:44:07.824     is_active: true,
16:44:07.824     created_at: '2026-01-04T21:20:33.701667+00:00',
16:44:07.824     updated_at: '2026-01-04T21:20:33.701667+00:00'
16:44:07.824   }
16:44:07.824 ]
16:44:07.985 Single assessment found: {
16:44:07.986   id: '7461ad48-0ba5-4dde-90bf-bfe6786da792',
16:44:07.986   title: 'AQA Listening Assessment - Foundation Paper 1 (Spanish)',
16:44:07.986   description: 'Foundation level AQA-style Spanish listening assessment with audio generated by Gemini TTS',
16:44:07.987   level: 'foundation',
16:44:07.987   language: 'es',
16:44:07.987   identifier: 'paper-1',
16:44:07.987   version: '1.0',
16:44:07.987   total_questions: 8,
16:44:07.987   time_limit_minutes: 35,
16:44:07.987   created_by: null,
16:44:07.988   is_active: true,
16:44:07.988   created_at: '2025-07-29T21:35:20.611146+00:00',
16:44:07.988   updated_at: '2026-01-04T20:51:19.436+00:00'
16:44:07.988 }
16:44:08.013 Sitemap generated with 363 URLs (including 291 grammar pages)
16:44:08.137 Questions found: 8
16:44:12.022    Generating static pages (202/810) 
16:44:22.120 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:22.120   assignmentId: null,
16:44:22.120   activityId: null,
16:44:22.120   mode: null,
16:44:22.120   topicId: '',
16:44:22.120   shouldWrap: false
16:44:22.120 }
16:44:22.120 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:22.120 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:22.120 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:22.120   assignmentId: null,
16:44:22.121   activityId: null,
16:44:22.121   mode: null,
16:44:22.121   topicId: '',
16:44:22.121   shouldWrap: false
16:44:22.121 }
16:44:22.121 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:22.121 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:22.121 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:22.121   assignmentId: null,
16:44:22.121   activityId: null,
16:44:22.121   mode: null,
16:44:22.121   topicId: '',
16:44:22.121   shouldWrap: false
16:44:22.121 }
16:44:22.121 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:22.121 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:22.270 🏗️ [GRAMMAR INDEX] Client component loaded
16:44:22.900 ReferenceError: location is not defined
16:44:22.900     at /vercel/path0/.next/server/chunks/45921.js:38:557619
16:44:22.900     at /vercel/path0/.next/server/chunks/45921.js:38:558379
16:44:22.900     at t.startTransition (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:108991)
16:44:22.900     at Object.replace (/vercel/path0/.next/server/chunks/45921.js:38:558367)
16:44:22.900     at j (/vercel/path0/.next/server/app/mobile-classes/page.js:1:12412)
16:44:22.900     at nj (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46252)
16:44:22.900     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47572)
16:44:22.900     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64547)
16:44:22.900     at nI (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47011)
16:44:22.901     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47718)
16:44:22.901     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:61547)
16:44:22.901     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64547)
16:44:22.901     at nB (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67539)
16:44:22.901     at nD (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:66681)
16:44:22.901     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64854)
16:44:22.901     at nB (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67539)
16:44:22.909 ReferenceError: location is not defined
16:44:22.909     at /vercel/path0/.next/server/chunks/45921.js:38:557619
16:44:22.909     at /vercel/path0/.next/server/chunks/45921.js:38:558379
16:44:22.909     at t.startTransition (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:108991)
16:44:22.909     at Object.replace (/vercel/path0/.next/server/chunks/45921.js:38:558367)
16:44:22.909     at y (/vercel/path0/.next/server/app/mobile-analytics/page.js:1:5647)
16:44:22.910     at nj (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46252)
16:44:22.910     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47572)
16:44:22.910     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64547)
16:44:22.910     at nI (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47011)
16:44:22.910     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47718)
16:44:23.190 ReferenceError: location is not defined
16:44:23.191     at /vercel/path0/.next/server/chunks/45921.js:38:557619
16:44:23.191     at /vercel/path0/.next/server/chunks/45921.js:38:558379
16:44:23.191     at t.startTransition (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:108991)
16:44:23.191     at Object.replace (/vercel/path0/.next/server/chunks/45921.js:38:558367)
16:44:23.191     at b (/vercel/path0/.next/server/app/mobile-teacher-assignments/page.js:8:5936)
16:44:23.191     at nj (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46252)
16:44:23.191     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47572)
16:44:23.191     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64547)
16:44:23.191     at nI (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47011)
16:44:23.191     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47718)
16:44:23.191     at nM (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:61547)
16:44:23.191     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64547)
16:44:23.191     at nB (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67539)
16:44:23.191     at nD (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:66681)
16:44:23.191     at nN (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64854)
16:44:23.191     at nB (/vercel/path0/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67539)
16:44:24.194    Generating static pages (404/810) 
16:44:25.241 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.241   assignmentId: null,
16:44:25.241   activityId: null,
16:44:25.241   mode: null,
16:44:25.241   topicId: '',
16:44:25.241   shouldWrap: false
16:44:25.241 }
16:44:25.241 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.241 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:25.273 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.274   assignmentId: null,
16:44:25.274   activityId: null,
16:44:25.274   mode: null,
16:44:25.274   topicId: '',
16:44:25.274   shouldWrap: false
16:44:25.275 }
16:44:25.275 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.275 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:25.434 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.434   assignmentId: null,
16:44:25.434   activityId: null,
16:44:25.434   mode: null,
16:44:25.434   topicId: '',
16:44:25.434   shouldWrap: false
16:44:25.434 }
16:44:25.434 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.434 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:25.944 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.944   assignmentId: null,
16:44:25.944   activityId: null,
16:44:25.944   mode: null,
16:44:25.944   topicId: '',
16:44:25.944   shouldWrap: false
16:44:25.945 }
16:44:25.945 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.945 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:25.993 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.993   assignmentId: null,
16:44:25.993   activityId: null,
16:44:25.993   mode: null,
16:44:25.993   topicId: '',
16:44:25.993   shouldWrap: false
16:44:25.993 }
16:44:25.993 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.993 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:25.993 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:25.994   assignmentId: null,
16:44:25.994   activityId: null,
16:44:25.994   mode: null,
16:44:25.994   topicId: '',
16:44:25.994   shouldWrap: false
16:44:25.994 }
16:44:25.994 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:25.994 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:26.434 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:26.434   assignmentId: null,
16:44:26.435   activityId: null,
16:44:26.435   mode: null,
16:44:26.435   topicId: '',
16:44:26.435   shouldWrap: false
16:44:26.435 }
16:44:26.435 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:26.435 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:26.523 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:26.524   assignmentId: null,
16:44:26.524   activityId: null,
16:44:26.524   mode: null,
16:44:26.524   topicId: '',
16:44:26.524   shouldWrap: false
16:44:26.525 }
16:44:26.525 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:26.525 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:26.692 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:26.693   assignmentId: null,
16:44:26.693   activityId: null,
16:44:26.693   mode: null,
16:44:26.693   topicId: '',
16:44:26.693   shouldWrap: false
16:44:26.693 }
16:44:26.694 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:26.694 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:27.045 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:27.046   assignmentId: null,
16:44:27.046   activityId: null,
16:44:27.046   mode: null,
16:44:27.046   topicId: '',
16:44:27.046   shouldWrap: false
16:44:27.046 }
16:44:27.046 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:27.046 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:27.057 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:27.057   assignmentId: null,
16:44:27.058   activityId: null,
16:44:27.058   mode: null,
16:44:27.058   topicId: '',
16:44:27.058   shouldWrap: false
16:44:27.058 }
16:44:27.058 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:27.058 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:27.170 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:27.170   assignmentId: null,
16:44:27.170   activityId: null,
16:44:27.170   mode: null,
16:44:27.170   topicId: '',
16:44:27.170   shouldWrap: false
16:44:27.170 }
16:44:27.170 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:27.170 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.309 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.309   assignmentId: null,
16:44:28.309   activityId: null,
16:44:28.310   mode: null,
16:44:28.310   topicId: '',
16:44:28.310   shouldWrap: false
16:44:28.310 }
16:44:28.310 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.310 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.332 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.332   assignmentId: null,
16:44:28.332   activityId: null,
16:44:28.332   mode: null,
16:44:28.332   topicId: '',
16:44:28.332   shouldWrap: false
16:44:28.332 }
16:44:28.332 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.333 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.333 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.333   assignmentId: null,
16:44:28.333   activityId: null,
16:44:28.333   mode: null,
16:44:28.333   topicId: '',
16:44:28.333   shouldWrap: false
16:44:28.333 }
16:44:28.333 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.333 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.790 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.790   assignmentId: null,
16:44:28.790   activityId: null,
16:44:28.790   mode: null,
16:44:28.790   topicId: '',
16:44:28.790   shouldWrap: false
16:44:28.790 }
16:44:28.790 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.790 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.823 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.824   assignmentId: null,
16:44:28.824   activityId: null,
16:44:28.824   mode: null,
16:44:28.825   topicId: '',
16:44:28.825   shouldWrap: false
16:44:28.825 }
16:44:28.825 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.825 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:28.839 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:28.839   assignmentId: null,
16:44:28.839   activityId: null,
16:44:28.839   mode: null,
16:44:28.839   topicId: '',
16:44:28.839   shouldWrap: false
16:44:28.839 }
16:44:28.840 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:28.840 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.303 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.303   assignmentId: null,
16:44:29.303   activityId: null,
16:44:29.303   mode: null,
16:44:29.303   topicId: '',
16:44:29.303   shouldWrap: false
16:44:29.303 }
16:44:29.303 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.303 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.307 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.308   assignmentId: null,
16:44:29.308   activityId: null,
16:44:29.308   mode: null,
16:44:29.308   topicId: '',
16:44:29.308   shouldWrap: false
16:44:29.308 }
16:44:29.308 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.308 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.328 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.328   assignmentId: null,
16:44:29.329   activityId: null,
16:44:29.329   mode: null,
16:44:29.330   topicId: '',
16:44:29.330   shouldWrap: false
16:44:29.331 }
16:44:29.331 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.331 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.792 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.792   assignmentId: null,
16:44:29.792   activityId: null,
16:44:29.792   mode: null,
16:44:29.792   topicId: '',
16:44:29.793   shouldWrap: false
16:44:29.793 }
16:44:29.793 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.793 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.793   assignmentId: null,
16:44:29.793   activityId: null,
16:44:29.793   mode: null,
16:44:29.793   topicId: '',
16:44:29.794   shouldWrap: false
16:44:29.794 }
16:44:29.794 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.794 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.794 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:29.819 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:29.819   assignmentId: null,
16:44:29.820   activityId: null,
16:44:29.820   mode: null,
16:44:29.820   topicId: '',
16:44:29.820   shouldWrap: false
16:44:29.820 }
16:44:29.820 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:29.820 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:30.260 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:30.260   assignmentId: null,
16:44:30.260   activityId: null,
16:44:30.260   mode: null,
16:44:30.260   topicId: '',
16:44:30.260   shouldWrap: false
16:44:30.260 }
16:44:30.260 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:30.261 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:30.283 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:30.284   assignmentId: null,
16:44:30.284   activityId: null,
16:44:30.284   mode: null,
16:44:30.284   topicId: '',
16:44:30.284   shouldWrap: false
16:44:30.284 }
16:44:30.284 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:30.284 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:30.570 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:30.570   assignmentId: null,
16:44:30.570   activityId: null,
16:44:30.571   mode: null,
16:44:30.571   topicId: '',
16:44:30.571   shouldWrap: false
16:44:30.571 }
16:44:30.571 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:30.571 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:30.750 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:30.750   assignmentId: null,
16:44:30.750   activityId: null,
16:44:30.751   mode: null,
16:44:30.751   topicId: '',
16:44:30.751   shouldWrap: false
16:44:30.751 }
16:44:30.751 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:30.751 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:30.751 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:30.751   assignmentId: null,
16:44:30.751   activityId: null,
16:44:30.751   mode: null,
16:44:30.751   topicId: '',
16:44:30.752   shouldWrap: false
16:44:30.752 }
16:44:30.752 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:30.752 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.092 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.092   assignmentId: null,
16:44:31.092   activityId: null,
16:44:31.092   mode: null,
16:44:31.092   topicId: '',
16:44:31.092   shouldWrap: false
16:44:31.092 }
16:44:31.092 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.092 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.233 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.233   assignmentId: null,
16:44:31.233   activityId: null,
16:44:31.233   mode: null,
16:44:31.233   topicId: '',
16:44:31.233   shouldWrap: false
16:44:31.233 }
16:44:31.233 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.234 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.247 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.248   assignmentId: null,
16:44:31.248   activityId: null,
16:44:31.248   mode: null,
16:44:31.248   topicId: '',
16:44:31.248   shouldWrap: false
16:44:31.248 }
16:44:31.248 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.248 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.597 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.597   assignmentId: null,
16:44:31.597   activityId: null,
16:44:31.597   mode: null,
16:44:31.597   topicId: '',
16:44:31.597   shouldWrap: false
16:44:31.597 }
16:44:31.597 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.597 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.720 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.721   assignmentId: null,
16:44:31.721   activityId: null,
16:44:31.721   mode: null,
16:44:31.721   topicId: '',
16:44:31.721   shouldWrap: false
16:44:31.721 }
16:44:31.721 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.721 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:31.745 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:31.745   assignmentId: null,
16:44:31.745   activityId: null,
16:44:31.745   mode: null,
16:44:31.745   topicId: '',
16:44:31.745   shouldWrap: false
16:44:31.745 }
16:44:31.745 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:31.745 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.075 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.075   assignmentId: null,
16:44:32.075   activityId: null,
16:44:32.075   mode: null,
16:44:32.075   topicId: '',
16:44:32.075   shouldWrap: false
16:44:32.075 }
16:44:32.075 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.076 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.209 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.209   assignmentId: null,
16:44:32.209   activityId: null,
16:44:32.210   mode: null,
16:44:32.210   topicId: '',
16:44:32.210   shouldWrap: false
16:44:32.210 }
16:44:32.210 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.210 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.222 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.222   assignmentId: null,
16:44:32.222   activityId: null,
16:44:32.222   mode: null,
16:44:32.222   topicId: '',
16:44:32.222   shouldWrap: false
16:44:32.223 }
16:44:32.223 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.223 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.563 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.563   assignmentId: null,
16:44:32.563   activityId: null,
16:44:32.563   mode: null,
16:44:32.563   topicId: '',
16:44:32.564   shouldWrap: false
16:44:32.564 }
16:44:32.564 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.564 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.702 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.702   assignmentId: null,
16:44:32.703   activityId: null,
16:44:32.703   mode: null,
16:44:32.703   topicId: '',
16:44:32.703   shouldWrap: false
16:44:32.703 }
16:44:32.703 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.703 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:32.739 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:32.739   assignmentId: null,
16:44:32.739   activityId: null,
16:44:32.740   mode: null,
16:44:32.740   topicId: '',
16:44:32.740   shouldWrap: false
16:44:32.740 }
16:44:32.740 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:32.740 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.194 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.195   assignmentId: null,
16:44:33.195   activityId: null,
16:44:33.195   mode: null,
16:44:33.195   topicId: '',
16:44:33.195   shouldWrap: false
16:44:33.195 }
16:44:33.195 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.195 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.286 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.286   assignmentId: null,
16:44:33.286   activityId: null,
16:44:33.286   mode: null,
16:44:33.286   topicId: '',
16:44:33.286   shouldWrap: false
16:44:33.286 }
16:44:33.287 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.287 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.293 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.293   assignmentId: null,
16:44:33.293   activityId: null,
16:44:33.293   mode: null,
16:44:33.293   topicId: '',
16:44:33.293   shouldWrap: false
16:44:33.293 }
16:44:33.293 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.293 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.699 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.699   assignmentId: null,
16:44:33.699   activityId: null,
16:44:33.699   mode: null,
16:44:33.699   topicId: '',
16:44:33.699   shouldWrap: false
16:44:33.699 }
16:44:33.699 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.699 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.785 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.785   assignmentId: null,
16:44:33.786   activityId: null,
16:44:33.786   mode: null,
16:44:33.786   topicId: '',
16:44:33.786   shouldWrap: false
16:44:33.786 }
16:44:33.786 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.786 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:33.900 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:33.901   assignmentId: null,
16:44:33.901   activityId: null,
16:44:33.901   mode: null,
16:44:33.901   topicId: '',
16:44:33.901   shouldWrap: false
16:44:33.901 }
16:44:33.901 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:33.901 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.227 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.227   assignmentId: null,
16:44:34.227   activityId: null,
16:44:34.227   mode: null,
16:44:34.227   topicId: '',
16:44:34.228   shouldWrap: false
16:44:34.228 }
16:44:34.228 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.228 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.287 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.287   assignmentId: null,
16:44:34.287   activityId: null,
16:44:34.287   mode: null,
16:44:34.287   topicId: '',
16:44:34.287   shouldWrap: false
16:44:34.287 }
16:44:34.287 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.288 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.398 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.398   assignmentId: null,
16:44:34.399   activityId: null,
16:44:34.399   mode: null,
16:44:34.399   topicId: '',
16:44:34.399   shouldWrap: false
16:44:34.399 }
16:44:34.399 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.399 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.716 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.716   assignmentId: null,
16:44:34.716   activityId: null,
16:44:34.716   mode: null,
16:44:34.717   topicId: '',
16:44:34.717   shouldWrap: false
16:44:34.717 }
16:44:34.717 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.717 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.762 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.762   assignmentId: null,
16:44:34.763   activityId: null,
16:44:34.763   mode: null,
16:44:34.763   topicId: '',
16:44:34.763   shouldWrap: false
16:44:34.763 }
16:44:34.763 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.763 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:34.915 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:34.915   assignmentId: null,
16:44:34.915   activityId: null,
16:44:34.915   mode: null,
16:44:34.915   topicId: '',
16:44:34.915   shouldWrap: false
16:44:34.915 }
16:44:34.915 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:34.915 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.242 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.243   assignmentId: null,
16:44:35.243   activityId: null,
16:44:35.243   mode: null,
16:44:35.243   topicId: '',
16:44:35.243   shouldWrap: false
16:44:35.243 }
16:44:35.243 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.243 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.390 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.390   assignmentId: null,
16:44:35.390   activityId: null,
16:44:35.390   mode: null,
16:44:35.391   topicId: '',
16:44:35.391   shouldWrap: false
16:44:35.391 }
16:44:35.391 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.391 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.429 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.429   assignmentId: null,
16:44:35.429   activityId: null,
16:44:35.429   mode: null,
16:44:35.429   topicId: '',
16:44:35.430   shouldWrap: false
16:44:35.430 }
16:44:35.430 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.430 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.730 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.730   assignmentId: null,
16:44:35.730   activityId: null,
16:44:35.730   mode: null,
16:44:35.730   topicId: '',
16:44:35.730   shouldWrap: false
16:44:35.730 }
16:44:35.730 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.730 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.897 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.897   assignmentId: null,
16:44:35.897   activityId: null,
16:44:35.898   mode: null,
16:44:35.898   topicId: '',
16:44:35.898   shouldWrap: false
16:44:35.898 }
16:44:35.898 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.898 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:35.908 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:35.908   assignmentId: null,
16:44:35.908   activityId: null,
16:44:35.908   mode: null,
16:44:35.908   topicId: '',
16:44:35.908   shouldWrap: false
16:44:35.908 }
16:44:35.908 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:35.908 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.214 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.214   assignmentId: null,
16:44:36.214   activityId: null,
16:44:36.214   mode: null,
16:44:36.214   topicId: '',
16:44:36.214   shouldWrap: false
16:44:36.214 }
16:44:36.214 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.214 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.379 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.379   assignmentId: null,
16:44:36.379   activityId: null,
16:44:36.379   mode: null,
16:44:36.379   topicId: '',
16:44:36.379   shouldWrap: false
16:44:36.379 }
16:44:36.379 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.379 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.411 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.411   assignmentId: null,
16:44:36.411   activityId: null,
16:44:36.411   mode: null,
16:44:36.411   topicId: '',
16:44:36.412   shouldWrap: false
16:44:36.412 }
16:44:36.412 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.412 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.718 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.718   assignmentId: null,
16:44:36.718   activityId: null,
16:44:36.718   mode: null,
16:44:36.719   topicId: '',
16:44:36.719   shouldWrap: false
16:44:36.719 }
16:44:36.719 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.719 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.855 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.855   assignmentId: null,
16:44:36.856   activityId: null,
16:44:36.856   mode: null,
16:44:36.856   topicId: '',
16:44:36.856   shouldWrap: false
16:44:36.856 }
16:44:36.856 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.856 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:36.915 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:36.915   assignmentId: null,
16:44:36.915   activityId: null,
16:44:36.915   mode: null,
16:44:36.915   topicId: '',
16:44:36.915   shouldWrap: false
16:44:36.915 }
16:44:36.915 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:36.915 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.221 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.221   assignmentId: null,
16:44:37.221   activityId: null,
16:44:37.221   mode: null,
16:44:37.221   topicId: '',
16:44:37.221   shouldWrap: false
16:44:37.221 }
16:44:37.221 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.222 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.356 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.356   assignmentId: null,
16:44:37.356   activityId: null,
16:44:37.357   mode: null,
16:44:37.357   topicId: '',
16:44:37.357   shouldWrap: false
16:44:37.357 }
16:44:37.357 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.357 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.430 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.431   assignmentId: null,
16:44:37.431   activityId: null,
16:44:37.431   mode: null,
16:44:37.431   topicId: '',
16:44:37.431   shouldWrap: false
16:44:37.431 }
16:44:37.431 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.431 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.716 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.716   assignmentId: null,
16:44:37.716   activityId: null,
16:44:37.716   mode: null,
16:44:37.716   topicId: '',
16:44:37.716   shouldWrap: false
16:44:37.716 }
16:44:37.716 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.717 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.839 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.839   assignmentId: null,
16:44:37.839   activityId: null,
16:44:37.839   mode: null,
16:44:37.839   topicId: '',
16:44:37.840   shouldWrap: false
16:44:37.840 }
16:44:37.840 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.840 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:37.937 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:37.937   assignmentId: null,
16:44:37.937   activityId: null,
16:44:37.937   mode: null,
16:44:37.937   topicId: '',
16:44:37.937   shouldWrap: false
16:44:37.937 }
16:44:37.937 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:37.937 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.331 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.331   assignmentId: null,
16:44:38.331   activityId: null,
16:44:38.331   mode: null,
16:44:38.331   topicId: '',
16:44:38.331   shouldWrap: false
16:44:38.331 }
16:44:38.331 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.331 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.350 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.350   assignmentId: null,
16:44:38.350   activityId: null,
16:44:38.351   mode: null,
16:44:38.351   topicId: '',
16:44:38.351   shouldWrap: false
16:44:38.351 }
16:44:38.351 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.351 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.431 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.432   assignmentId: null,
16:44:38.432   activityId: null,
16:44:38.432   mode: null,
16:44:38.432   topicId: '',
16:44:38.432   shouldWrap: false
16:44:38.432 }
16:44:38.432 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.432 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.826 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.826   assignmentId: null,
16:44:38.826   activityId: null,
16:44:38.826   mode: null,
16:44:38.826   topicId: '',
16:44:38.826   shouldWrap: false
16:44:38.826 }
16:44:38.826 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.826 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.903 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.904   assignmentId: null,
16:44:38.904   activityId: null,
16:44:38.904   mode: null,
16:44:38.904   topicId: '',
16:44:38.904   shouldWrap: false
16:44:38.904 }
16:44:38.904 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.904 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:38.922 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:38.922   assignmentId: null,
16:44:38.922   activityId: null,
16:44:38.922   mode: null,
16:44:38.923   topicId: '',
16:44:38.923   shouldWrap: false
16:44:38.923 }
16:44:38.923 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:38.923 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.332 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.332   assignmentId: null,
16:44:39.332   activityId: null,
16:44:39.332   mode: null,
16:44:39.332   topicId: '',
16:44:39.332   shouldWrap: false
16:44:39.332 }
16:44:39.332 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.333 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.399 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.399   assignmentId: null,
16:44:39.399   activityId: null,
16:44:39.400   mode: null,
16:44:39.400   topicId: '',
16:44:39.400   shouldWrap: false
16:44:39.400 }
16:44:39.400 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.400 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.406 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.406   assignmentId: null,
16:44:39.407   activityId: null,
16:44:39.407   mode: null,
16:44:39.407   topicId: '',
16:44:39.407   shouldWrap: false
16:44:39.407 }
16:44:39.407 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.407 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.839 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.839   assignmentId: null,
16:44:39.839   activityId: null,
16:44:39.839   mode: null,
16:44:39.839   topicId: '',
16:44:39.839   shouldWrap: false
16:44:39.839 }
16:44:39.839 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.839 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.929 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.930   assignmentId: null,
16:44:39.930   activityId: null,
16:44:39.930   mode: null,
16:44:39.930   topicId: '',
16:44:39.930   shouldWrap: false
16:44:39.930 }
16:44:39.930 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.930 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:39.930 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:39.930   assignmentId: null,
16:44:39.930   activityId: null,
16:44:39.930   mode: null,
16:44:39.931   topicId: '',
16:44:39.931   shouldWrap: false
16:44:39.931 }
16:44:39.931 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:39.932 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.325 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.325   assignmentId: null,
16:44:40.325   activityId: null,
16:44:40.326   mode: null,
16:44:40.326   topicId: '',
16:44:40.326   shouldWrap: false
16:44:40.326 }
16:44:40.326 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.326 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.419 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.419   assignmentId: null,
16:44:40.419   activityId: null,
16:44:40.419   mode: null,
16:44:40.419   topicId: '',
16:44:40.419   shouldWrap: false
16:44:40.419 }
16:44:40.419 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.420 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.434 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.434   assignmentId: null,
16:44:40.434   activityId: null,
16:44:40.434   mode: null,
16:44:40.434   topicId: '',
16:44:40.434   shouldWrap: false
16:44:40.434 }
16:44:40.434 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.435 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.799 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.799   assignmentId: null,
16:44:40.799   activityId: null,
16:44:40.799   mode: null,
16:44:40.799   topicId: '',
16:44:40.799   shouldWrap: false
16:44:40.799 }
16:44:40.800 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.800 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.910 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.911   assignmentId: null,
16:44:40.911   activityId: null,
16:44:40.911   mode: null,
16:44:40.911   topicId: '',
16:44:40.911   shouldWrap: false
16:44:40.911 }
16:44:40.911 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.911 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:40.924 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:40.924   assignmentId: null,
16:44:40.924   activityId: null,
16:44:40.924   mode: null,
16:44:40.925   topicId: '',
16:44:40.925   shouldWrap: false
16:44:40.925 }
16:44:40.925 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:40.925 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.280 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.280   assignmentId: null,
16:44:41.280   activityId: null,
16:44:41.280   mode: null,
16:44:41.280   topicId: '',
16:44:41.280   shouldWrap: false
16:44:41.281 }
16:44:41.281 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.281 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.411 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.411   assignmentId: null,
16:44:41.411   activityId: null,
16:44:41.411   mode: null,
16:44:41.411   topicId: '',
16:44:41.411   shouldWrap: false
16:44:41.412 }
16:44:41.412 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.412 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.430 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.430   assignmentId: null,
16:44:41.431   activityId: null,
16:44:41.431   mode: null,
16:44:41.431   topicId: '',
16:44:41.431   shouldWrap: false
16:44:41.431 }
16:44:41.431 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.431 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.795 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.796   assignmentId: null,
16:44:41.796   activityId: null,
16:44:41.796   mode: null,
16:44:41.796   topicId: '',
16:44:41.796   shouldWrap: false
16:44:41.796 }
16:44:41.796 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.796 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.941 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.942   assignmentId: null,
16:44:41.942   activityId: null,
16:44:41.942   mode: null,
16:44:41.942   topicId: '',
16:44:41.942   shouldWrap: false
16:44:41.942 }
16:44:41.942 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.942 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:41.950 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:41.950   assignmentId: null,
16:44:41.950   activityId: null,
16:44:41.950   mode: null,
16:44:41.950   topicId: '',
16:44:41.950   shouldWrap: false
16:44:41.950 }
16:44:41.950 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:41.950 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.306 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.306   assignmentId: null,
16:44:42.306   activityId: null,
16:44:42.306   mode: null,
16:44:42.306   topicId: '',
16:44:42.306   shouldWrap: false
16:44:42.306 }
16:44:42.306 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.307 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.431 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.431   assignmentId: null,
16:44:42.431   activityId: null,
16:44:42.431   mode: null,
16:44:42.431   topicId: '',
16:44:42.431   shouldWrap: false
16:44:42.431 }
16:44:42.431 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.431 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.446 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.447   assignmentId: null,
16:44:42.447   activityId: null,
16:44:42.447   mode: null,
16:44:42.447   topicId: '',
16:44:42.447   shouldWrap: false
16:44:42.448 }
16:44:42.448 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.448 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.781 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.781   assignmentId: null,
16:44:42.781   activityId: null,
16:44:42.781   mode: null,
16:44:42.781   topicId: '',
16:44:42.781   shouldWrap: false
16:44:42.781 }
16:44:42.781 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.781 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.914 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.914   assignmentId: null,
16:44:42.914   activityId: null,
16:44:42.914   mode: null,
16:44:42.914   topicId: '',
16:44:42.914   shouldWrap: false
16:44:42.914 }
16:44:42.914 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.915 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:42.929 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:42.929   assignmentId: null,
16:44:42.929   activityId: null,
16:44:42.930   mode: null,
16:44:42.930   topicId: '',
16:44:42.930   shouldWrap: false
16:44:42.930 }
16:44:42.931 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:42.931 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.273 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.273   assignmentId: null,
16:44:43.273   activityId: null,
16:44:43.274   mode: null,
16:44:43.274   topicId: '',
16:44:43.274   shouldWrap: false
16:44:43.274 }
16:44:43.274 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.274 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.397 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.397   assignmentId: null,
16:44:43.397   activityId: null,
16:44:43.397   mode: null,
16:44:43.397   topicId: '',
16:44:43.397   shouldWrap: false
16:44:43.397 }
16:44:43.398 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.398 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.435 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.435   assignmentId: null,
16:44:43.436   activityId: null,
16:44:43.436   mode: null,
16:44:43.436   topicId: '',
16:44:43.436   shouldWrap: false
16:44:43.436 }
16:44:43.436 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.436 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.755 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.755   assignmentId: null,
16:44:43.755   activityId: null,
16:44:43.755   mode: null,
16:44:43.756   topicId: '',
16:44:43.756   shouldWrap: false
16:44:43.756 }
16:44:43.756 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.756 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.882 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.883   assignmentId: null,
16:44:43.883   activityId: null,
16:44:43.883   mode: null,
16:44:43.883   topicId: '',
16:44:43.883   shouldWrap: false
16:44:43.883 }
16:44:43.883 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.883 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:43.943 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:43.943   assignmentId: null,
16:44:43.944   activityId: null,
16:44:43.944   mode: null,
16:44:43.944   topicId: '',
16:44:43.944   shouldWrap: false
16:44:43.944 }
16:44:43.944 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:43.944 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.240 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.240   assignmentId: null,
16:44:44.240   activityId: null,
16:44:44.240   mode: null,
16:44:44.241   topicId: '',
16:44:44.241   shouldWrap: false
16:44:44.241 }
16:44:44.241 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.241 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.366 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.366   assignmentId: null,
16:44:44.366   activityId: null,
16:44:44.366   mode: null,
16:44:44.366   topicId: '',
16:44:44.366   shouldWrap: false
16:44:44.366 }
16:44:44.366 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.366 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.432 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.433   assignmentId: null,
16:44:44.433   activityId: null,
16:44:44.433   mode: null,
16:44:44.433   topicId: '',
16:44:44.433   shouldWrap: false
16:44:44.433 }
16:44:44.433 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.433 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.754 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.755   assignmentId: null,
16:44:44.755   activityId: null,
16:44:44.755   mode: null,
16:44:44.755   topicId: '',
16:44:44.755   shouldWrap: false
16:44:44.755 }
16:44:44.755 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.755 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.869 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.869   assignmentId: null,
16:44:44.869   activityId: null,
16:44:44.869   mode: null,
16:44:44.869   topicId: '',
16:44:44.869   shouldWrap: false
16:44:44.869 }
16:44:44.869 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.869 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:44.921 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:44.921   assignmentId: null,
16:44:44.921   activityId: null,
16:44:44.921   mode: null,
16:44:44.921   topicId: '',
16:44:44.921   shouldWrap: false
16:44:44.921 }
16:44:44.921 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:44.921 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.260 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.260   assignmentId: null,
16:44:45.260   activityId: null,
16:44:45.260   mode: null,
16:44:45.260   topicId: '',
16:44:45.260   shouldWrap: false
16:44:45.260 }
16:44:45.260 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.260 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.369 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.369   assignmentId: null,
16:44:45.369   activityId: null,
16:44:45.369   mode: null,
16:44:45.369   topicId: '',
16:44:45.369   shouldWrap: false
16:44:45.369 }
16:44:45.369 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.369 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.427 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.428   assignmentId: null,
16:44:45.428   activityId: null,
16:44:45.428   mode: null,
16:44:45.428   topicId: '',
16:44:45.428   shouldWrap: false
16:44:45.428 }
16:44:45.428 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.428 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.754 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.754   assignmentId: null,
16:44:45.754   activityId: null,
16:44:45.754   mode: null,
16:44:45.755   topicId: '',
16:44:45.755   shouldWrap: false
16:44:45.755 }
16:44:45.755 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.755 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.872 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.872   assignmentId: null,
16:44:45.872   activityId: null,
16:44:45.872   mode: null,
16:44:45.873   topicId: '',
16:44:45.873   shouldWrap: false
16:44:45.873 }
16:44:45.873 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.873 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:45.922 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:45.922   assignmentId: null,
16:44:45.922   activityId: null,
16:44:45.922   mode: null,
16:44:45.922   topicId: '',
16:44:45.922   shouldWrap: false
16:44:45.922 }
16:44:45.922 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:45.922 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.238 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.238   assignmentId: null,
16:44:46.238   activityId: null,
16:44:46.238   mode: null,
16:44:46.238   topicId: '',
16:44:46.238   shouldWrap: false
16:44:46.238 }
16:44:46.238 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.239 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.350 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.350   assignmentId: null,
16:44:46.350   activityId: null,
16:44:46.350   mode: null,
16:44:46.350   topicId: '',
16:44:46.350   shouldWrap: false
16:44:46.350 }
16:44:46.350 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.350 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.405 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.405   assignmentId: null,
16:44:46.405   activityId: null,
16:44:46.405   mode: null,
16:44:46.405   topicId: '',
16:44:46.405   shouldWrap: false
16:44:46.405 }
16:44:46.405 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.406 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.713 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.713   assignmentId: null,
16:44:46.713   activityId: null,
16:44:46.713   mode: null,
16:44:46.713   topicId: '',
16:44:46.713   shouldWrap: false
16:44:46.713 }
16:44:46.713 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.713 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.827 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.827   assignmentId: null,
16:44:46.827   activityId: null,
16:44:46.827   mode: null,
16:44:46.827   topicId: '',
16:44:46.827   shouldWrap: false
16:44:46.827 }
16:44:46.827 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.827 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:46.958 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:46.959   assignmentId: null,
16:44:46.959   activityId: null,
16:44:46.959   mode: null,
16:44:46.959   topicId: '',
16:44:46.959   shouldWrap: false
16:44:46.959 }
16:44:46.959 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:46.959 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.218 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.218   assignmentId: null,
16:44:47.218   activityId: null,
16:44:47.218   mode: null,
16:44:47.218   topicId: '',
16:44:47.218   shouldWrap: false
16:44:47.218 }
16:44:47.218 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.218 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.343 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.343   assignmentId: null,
16:44:47.343   activityId: null,
16:44:47.343   mode: null,
16:44:47.343   topicId: '',
16:44:47.343   shouldWrap: false
16:44:47.343 }
16:44:47.343 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.344 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.446 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.446   assignmentId: null,
16:44:47.446   activityId: null,
16:44:47.446   mode: null,
16:44:47.446   topicId: '',
16:44:47.446   shouldWrap: false
16:44:47.446 }
16:44:47.446 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.446 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.706 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.706   assignmentId: null,
16:44:47.706   activityId: null,
16:44:47.706   mode: null,
16:44:47.706   topicId: '',
16:44:47.706   shouldWrap: false
16:44:47.706 }
16:44:47.706 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.707 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.821 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.821   assignmentId: null,
16:44:47.822   activityId: null,
16:44:47.822   mode: null,
16:44:47.822   topicId: '',
16:44:47.822   shouldWrap: false
16:44:47.822 }
16:44:47.822 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.822 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:47.958 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:47.958   assignmentId: null,
16:44:47.958   activityId: null,
16:44:47.958   mode: null,
16:44:47.958   topicId: '',
16:44:47.958   shouldWrap: false
16:44:47.959 }
16:44:47.959 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:47.959 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.191 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.191   assignmentId: null,
16:44:48.191   activityId: null,
16:44:48.191   mode: null,
16:44:48.191   topicId: '',
16:44:48.191   shouldWrap: false
16:44:48.191 }
16:44:48.191 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.191 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.304 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.305   assignmentId: null,
16:44:48.305   activityId: null,
16:44:48.305   mode: null,
16:44:48.305   topicId: '',
16:44:48.305   shouldWrap: false
16:44:48.305 }
16:44:48.305 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.305 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.446 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.446   assignmentId: null,
16:44:48.446   activityId: null,
16:44:48.446   mode: null,
16:44:48.447   topicId: '',
16:44:48.447   shouldWrap: false
16:44:48.447 }
16:44:48.447 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.447 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.669 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.669   assignmentId: null,
16:44:48.669   activityId: null,
16:44:48.669   mode: null,
16:44:48.669   topicId: '',
16:44:48.669   shouldWrap: false
16:44:48.669 }
16:44:48.669 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.670 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.809 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.809   assignmentId: null,
16:44:48.809   activityId: null,
16:44:48.810   mode: null,
16:44:48.810   topicId: '',
16:44:48.810   shouldWrap: false
16:44:48.810 }
16:44:48.810 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.810 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:48.921 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:48.922   assignmentId: null,
16:44:48.922   activityId: null,
16:44:48.922   mode: null,
16:44:48.922   topicId: '',
16:44:48.923   shouldWrap: false
16:44:48.923 }
16:44:48.923 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:48.924 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.165 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.165   assignmentId: null,
16:44:49.165   activityId: null,
16:44:49.166   mode: null,
16:44:49.166   topicId: '',
16:44:49.166   shouldWrap: false
16:44:49.166 }
16:44:49.166 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.166 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.312 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.312   assignmentId: null,
16:44:49.312   activityId: null,
16:44:49.312   mode: null,
16:44:49.312   topicId: '',
16:44:49.312   shouldWrap: false
16:44:49.312 }
16:44:49.312 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.312 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.435 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.435   assignmentId: null,
16:44:49.435   activityId: null,
16:44:49.435   mode: null,
16:44:49.435   topicId: '',
16:44:49.435   shouldWrap: false
16:44:49.435 }
16:44:49.435 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.436 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.651 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.651   assignmentId: null,
16:44:49.651   activityId: null,
16:44:49.651   mode: null,
16:44:49.651   topicId: '',
16:44:49.651   shouldWrap: false
16:44:49.652 }
16:44:49.652 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.652 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.819 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.820   assignmentId: null,
16:44:49.820   activityId: null,
16:44:49.820   mode: null,
16:44:49.820   topicId: '',
16:44:49.820   shouldWrap: false
16:44:49.820 }
16:44:49.820 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.820 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:49.911 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:49.912   assignmentId: null,
16:44:49.912   activityId: null,
16:44:49.912   mode: null,
16:44:49.912   topicId: '',
16:44:49.912   shouldWrap: false
16:44:49.912 }
16:44:49.912 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:49.912 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.155 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.155   assignmentId: null,
16:44:50.155   activityId: null,
16:44:50.155   mode: null,
16:44:50.155   topicId: '',
16:44:50.155   shouldWrap: false
16:44:50.155 }
16:44:50.155 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.155 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.305 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.305   assignmentId: null,
16:44:50.305   activityId: null,
16:44:50.305   mode: null,
16:44:50.305   topicId: '',
16:44:50.305   shouldWrap: false
16:44:50.305 }
16:44:50.305 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.305 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.403 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.403   assignmentId: null,
16:44:50.403   activityId: null,
16:44:50.403   mode: null,
16:44:50.403   topicId: '',
16:44:50.403   shouldWrap: false
16:44:50.403 }
16:44:50.403 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.403 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.639 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.639   assignmentId: null,
16:44:50.639   activityId: null,
16:44:50.639   mode: null,
16:44:50.639   topicId: '',
16:44:50.639   shouldWrap: false
16:44:50.639 }
16:44:50.639 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.639 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.797 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.797   assignmentId: null,
16:44:50.797   activityId: null,
16:44:50.797   mode: null,
16:44:50.797   topicId: '',
16:44:50.797   shouldWrap: false
16:44:50.797 }
16:44:50.797 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.797 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:50.936 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:50.936   assignmentId: null,
16:44:50.936   activityId: null,
16:44:50.936   mode: null,
16:44:50.936   topicId: '',
16:44:50.936   shouldWrap: false
16:44:50.936 }
16:44:50.936 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:50.936 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.131 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.131   assignmentId: null,
16:44:51.131   activityId: null,
16:44:51.131   mode: null,
16:44:51.131   topicId: '',
16:44:51.131   shouldWrap: false
16:44:51.131 }
16:44:51.131 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.131 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.328 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.328   assignmentId: null,
16:44:51.328   activityId: null,
16:44:51.328   mode: null,
16:44:51.328   topicId: '',
16:44:51.329   shouldWrap: false
16:44:51.329 }
16:44:51.329 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.329 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.455 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.455   assignmentId: null,
16:44:51.456   activityId: null,
16:44:51.456   mode: null,
16:44:51.456   topicId: '',
16:44:51.456   shouldWrap: false
16:44:51.456 }
16:44:51.456 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.456 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.633 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.633   assignmentId: null,
16:44:51.633   activityId: null,
16:44:51.633   mode: null,
16:44:51.633   topicId: '',
16:44:51.633   shouldWrap: false
16:44:51.633 }
16:44:51.633 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.633 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.836 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.836   assignmentId: null,
16:44:51.836   activityId: null,
16:44:51.836   mode: null,
16:44:51.836   topicId: '',
16:44:51.836   shouldWrap: false
16:44:51.836 }
16:44:51.836 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.836 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:51.941 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:51.941   assignmentId: null,
16:44:51.941   activityId: null,
16:44:51.941   mode: null,
16:44:51.941   topicId: '',
16:44:51.941   shouldWrap: false
16:44:51.941 }
16:44:51.941 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:51.941 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.121 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.122   assignmentId: null,
16:44:52.122   activityId: null,
16:44:52.122   mode: null,
16:44:52.122   topicId: '',
16:44:52.122   shouldWrap: false
16:44:52.122 }
16:44:52.122 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.122 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.330 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.330   assignmentId: null,
16:44:52.330   activityId: null,
16:44:52.330   mode: null,
16:44:52.330   topicId: '',
16:44:52.330   shouldWrap: false
16:44:52.330 }
16:44:52.330 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.330 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.336    Generating static pages (607/810) 
16:44:52.424 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.424   assignmentId: null,
16:44:52.424   activityId: null,
16:44:52.424   mode: null,
16:44:52.424   topicId: '',
16:44:52.424   shouldWrap: false
16:44:52.425 }
16:44:52.425 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.425 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.616 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.616   assignmentId: null,
16:44:52.616   activityId: null,
16:44:52.616   mode: null,
16:44:52.616   topicId: '',
16:44:52.616   shouldWrap: false
16:44:52.616 }
16:44:52.616 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.617 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.818 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.818   assignmentId: null,
16:44:52.818   activityId: null,
16:44:52.818   mode: null,
16:44:52.818   topicId: '',
16:44:52.818   shouldWrap: false
16:44:52.818 }
16:44:52.818 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.819 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:52.923 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:52.923   assignmentId: null,
16:44:52.923   activityId: null,
16:44:52.924   mode: null,
16:44:52.924   topicId: '',
16:44:52.924   shouldWrap: false
16:44:52.924 }
16:44:52.924 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:52.924 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.126 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.126   assignmentId: null,
16:44:53.126   activityId: null,
16:44:53.126   mode: null,
16:44:53.126   topicId: '',
16:44:53.126   shouldWrap: false
16:44:53.126 }
16:44:53.126 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.126 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.372 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.372   assignmentId: null,
16:44:53.372   activityId: null,
16:44:53.372   mode: null,
16:44:53.372   topicId: '',
16:44:53.372   shouldWrap: false
16:44:53.372 }
16:44:53.372 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.372 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.410 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.410   assignmentId: null,
16:44:53.410   activityId: null,
16:44:53.410   mode: null,
16:44:53.410   topicId: '',
16:44:53.410   shouldWrap: false
16:44:53.410 }
16:44:53.410 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.410 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.625 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.625   assignmentId: null,
16:44:53.625   activityId: null,
16:44:53.625   mode: null,
16:44:53.625   topicId: '',
16:44:53.625   shouldWrap: false
16:44:53.625 }
16:44:53.625 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.626 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.890 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.890   assignmentId: null,
16:44:53.890   activityId: null,
16:44:53.890   mode: null,
16:44:53.890   topicId: '',
16:44:53.890   shouldWrap: false
16:44:53.890 }
16:44:53.890 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.890 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:53.899 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:53.902   assignmentId: null,
16:44:53.902   activityId: null,
16:44:53.902   mode: null,
16:44:53.902   topicId: '',
16:44:53.902   shouldWrap: false
16:44:53.902 }
16:44:53.902 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:53.902 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.112 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.112   assignmentId: null,
16:44:54.112   activityId: null,
16:44:54.112   mode: null,
16:44:54.112   topicId: '',
16:44:54.112   shouldWrap: false
16:44:54.112 }
16:44:54.112 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.112 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.397 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.397   assignmentId: null,
16:44:54.397   activityId: null,
16:44:54.397   mode: null,
16:44:54.397   topicId: '',
16:44:54.397   shouldWrap: false
16:44:54.397 }
16:44:54.397 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.398 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.434 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.434   assignmentId: null,
16:44:54.434   activityId: null,
16:44:54.434   mode: null,
16:44:54.434   topicId: '',
16:44:54.434   shouldWrap: false
16:44:54.434 }
16:44:54.434 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.435 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.602 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.602   assignmentId: null,
16:44:54.602   activityId: null,
16:44:54.602   mode: null,
16:44:54.602   topicId: '',
16:44:54.602   shouldWrap: false
16:44:54.602 }
16:44:54.602 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.602 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.908 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.908   assignmentId: null,
16:44:54.908   activityId: null,
16:44:54.908   mode: null,
16:44:54.908   topicId: '',
16:44:54.908   shouldWrap: false
16:44:54.908 }
16:44:54.908 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.908 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:54.927 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:54.927   assignmentId: null,
16:44:54.928   activityId: null,
16:44:54.928   mode: null,
16:44:54.928   topicId: '',
16:44:54.928   shouldWrap: false
16:44:54.928 }
16:44:54.928 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:54.928 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.096 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.097   assignmentId: null,
16:44:55.097   activityId: null,
16:44:55.097   mode: null,
16:44:55.097   topicId: '',
16:44:55.097   shouldWrap: false
16:44:55.097 }
16:44:55.097 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.097 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.406 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.406   assignmentId: null,
16:44:55.406   activityId: null,
16:44:55.406   mode: null,
16:44:55.406   topicId: '',
16:44:55.406   shouldWrap: false
16:44:55.406 }
16:44:55.406 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.406 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.432 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.432   assignmentId: null,
16:44:55.432   activityId: null,
16:44:55.432   mode: null,
16:44:55.432   topicId: '',
16:44:55.432   shouldWrap: false
16:44:55.432 }
16:44:55.432 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.432 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.587 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.587   assignmentId: null,
16:44:55.587   activityId: null,
16:44:55.587   mode: null,
16:44:55.587   topicId: '',
16:44:55.587   shouldWrap: false
16:44:55.587 }
16:44:55.587 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.587 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.893 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.893   assignmentId: null,
16:44:55.893   activityId: null,
16:44:55.893   mode: null,
16:44:55.893   topicId: '',
16:44:55.893   shouldWrap: false
16:44:55.893 }
16:44:55.893 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.893 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:55.907 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:55.907   assignmentId: null,
16:44:55.907   activityId: null,
16:44:55.908   mode: null,
16:44:55.908   topicId: '',
16:44:55.908   shouldWrap: false
16:44:55.908 }
16:44:55.908 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:55.908 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.084 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.084   assignmentId: null,
16:44:56.084   activityId: null,
16:44:56.084   mode: null,
16:44:56.084   topicId: '',
16:44:56.084   shouldWrap: false
16:44:56.084 }
16:44:56.084 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.084 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.380 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.381   assignmentId: null,
16:44:56.381   activityId: null,
16:44:56.381   mode: null,
16:44:56.381   topicId: '',
16:44:56.381   shouldWrap: false
16:44:56.381 }
16:44:56.381 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.381 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.420 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.420   assignmentId: null,
16:44:56.420   activityId: null,
16:44:56.420   mode: null,
16:44:56.420   topicId: '',
16:44:56.420   shouldWrap: false
16:44:56.420 }
16:44:56.420 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.420 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.564 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.564   assignmentId: null,
16:44:56.564   activityId: null,
16:44:56.564   mode: null,
16:44:56.564   topicId: '',
16:44:56.564   shouldWrap: false
16:44:56.564 }
16:44:56.564 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.565 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.864 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.864   assignmentId: null,
16:44:56.864   activityId: null,
16:44:56.865   mode: null,
16:44:56.865   topicId: '',
16:44:56.865   shouldWrap: false
16:44:56.865 }
16:44:56.865 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.865 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:56.912 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:56.912   assignmentId: null,
16:44:56.912   activityId: null,
16:44:56.912   mode: null,
16:44:56.912   topicId: '',
16:44:56.912   shouldWrap: false
16:44:56.912 }
16:44:56.912 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:56.912 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.075 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.075   assignmentId: null,
16:44:57.075   activityId: null,
16:44:57.075   mode: null,
16:44:57.075   topicId: '',
16:44:57.075   shouldWrap: false
16:44:57.075 }
16:44:57.075 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.076 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.349 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.349   assignmentId: null,
16:44:57.349   activityId: null,
16:44:57.349   mode: null,
16:44:57.349   topicId: '',
16:44:57.349   shouldWrap: false
16:44:57.349 }
16:44:57.349 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.349 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.391 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.391   assignmentId: null,
16:44:57.391   activityId: null,
16:44:57.391   mode: null,
16:44:57.391   topicId: '',
16:44:57.391   shouldWrap: false
16:44:57.391 }
16:44:57.391 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.392 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.609 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.609   assignmentId: null,
16:44:57.609   activityId: null,
16:44:57.609   mode: null,
16:44:57.609   topicId: '',
16:44:57.609   shouldWrap: false
16:44:57.609 }
16:44:57.609 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.609 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.837 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.837   assignmentId: null,
16:44:57.837   activityId: null,
16:44:57.837   mode: null,
16:44:57.837   topicId: '',
16:44:57.837   shouldWrap: false
16:44:57.837 }
16:44:57.837 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.837 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:57.870 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:57.870   assignmentId: null,
16:44:57.870   activityId: null,
16:44:57.870   mode: null,
16:44:57.870   topicId: '',
16:44:57.870   shouldWrap: false
16:44:57.870 }
16:44:57.870 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:57.871 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.095 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.095   assignmentId: null,
16:44:58.095   activityId: null,
16:44:58.095   mode: null,
16:44:58.095   topicId: '',
16:44:58.095   shouldWrap: false
16:44:58.095 }
16:44:58.095 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.096 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.356 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.357   assignmentId: null,
16:44:58.357   activityId: null,
16:44:58.357   mode: null,
16:44:58.357   topicId: '',
16:44:58.357   shouldWrap: false
16:44:58.357 }
16:44:58.357 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.357 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.404 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.404   assignmentId: null,
16:44:58.404   activityId: null,
16:44:58.404   mode: null,
16:44:58.404   topicId: '',
16:44:58.404   shouldWrap: false
16:44:58.404 }
16:44:58.404 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.404 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.563 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.563   assignmentId: null,
16:44:58.563   activityId: null,
16:44:58.563   mode: null,
16:44:58.563   topicId: '',
16:44:58.563   shouldWrap: false
16:44:58.564 }
16:44:58.564 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.564 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.857 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.857   assignmentId: null,
16:44:58.857   activityId: null,
16:44:58.857   mode: null,
16:44:58.857   topicId: '',
16:44:58.857   shouldWrap: false
16:44:58.857 }
16:44:58.857 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.857 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:58.901 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:58.901   assignmentId: null,
16:44:58.901   activityId: null,
16:44:58.901   mode: null,
16:44:58.901   topicId: '',
16:44:58.901   shouldWrap: false
16:44:58.901 }
16:44:58.901 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:58.901 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.062 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.062   assignmentId: null,
16:44:59.062   activityId: null,
16:44:59.062   mode: null,
16:44:59.063   topicId: '',
16:44:59.063   shouldWrap: false
16:44:59.063 }
16:44:59.063 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.063 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.376 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.376   assignmentId: null,
16:44:59.376   activityId: null,
16:44:59.376   mode: null,
16:44:59.376   topicId: '',
16:44:59.377   shouldWrap: false
16:44:59.377 }
16:44:59.377 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.377 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.396 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.396   assignmentId: null,
16:44:59.396   activityId: null,
16:44:59.396   mode: null,
16:44:59.397   topicId: '',
16:44:59.397   shouldWrap: false
16:44:59.397 }
16:44:59.397 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.397 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.568 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.569   assignmentId: null,
16:44:59.569   activityId: null,
16:44:59.569   mode: null,
16:44:59.569   topicId: '',
16:44:59.569   shouldWrap: false
16:44:59.569 }
16:44:59.569 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.569 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.895 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.895   assignmentId: null,
16:44:59.895   activityId: null,
16:44:59.895   mode: null,
16:44:59.895   topicId: '',
16:44:59.895   shouldWrap: false
16:44:59.895 }
16:44:59.895 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.895 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:44:59.895 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:44:59.895   assignmentId: null,
16:44:59.895   activityId: null,
16:44:59.895   mode: null,
16:44:59.895   topicId: '',
16:44:59.895   shouldWrap: false
16:44:59.895 }
16:44:59.895 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:44:59.895 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:00.077 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:00.077   assignmentId: null,
16:45:00.077   activityId: null,
16:45:00.077   mode: null,
16:45:00.077   topicId: '',
16:45:00.077   shouldWrap: false
16:45:00.077 }
16:45:00.077 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:00.078 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:00.388 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:00.388   assignmentId: null,
16:45:00.388   activityId: null,
16:45:00.389   mode: null,
16:45:00.389   topicId: '',
16:45:00.389   shouldWrap: false
16:45:00.389 }
16:45:00.389 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:00.389 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:00.391 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:00.391   assignmentId: null,
16:45:00.391   activityId: null,
16:45:00.391   mode: null,
16:45:00.391   topicId: '',
16:45:00.391   shouldWrap: false
16:45:00.391 }
16:45:00.391 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:00.391 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:00.587 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:00.587   assignmentId: null,
16:45:00.587   activityId: null,
16:45:00.587   mode: null,
16:45:00.587   topicId: '',
16:45:00.587   shouldWrap: false
16:45:00.587 }
16:45:00.587 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:00.587 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:00.895 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:00.895   assignmentId: null,
16:45:00.895   activityId: null,
16:45:00.895   mode: null,
16:45:00.895   topicId: '',
16:45:00.895   shouldWrap: false
16:45:00.895 }
16:45:00.895 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:00.895 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:01.023 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:01.023   assignmentId: null,
16:45:01.023   activityId: null,
16:45:01.023   mode: null,
16:45:01.023   topicId: '',
16:45:01.023   shouldWrap: false
16:45:01.023 }
16:45:01.023 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:01.023 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:01.103 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:01.103   assignmentId: null,
16:45:01.103   activityId: null,
16:45:01.103   mode: null,
16:45:01.103   topicId: '',
16:45:01.103   shouldWrap: false
16:45:01.104 }
16:45:01.104 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:01.104 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:01.617 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:01.618   assignmentId: null,
16:45:01.618   activityId: null,
16:45:01.618   mode: null,
16:45:01.618   topicId: '',
16:45:01.618   shouldWrap: false
16:45:01.618 }
16:45:01.618 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:01.618 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:01.658 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:01.658   assignmentId: null,
16:45:01.658   activityId: null,
16:45:01.658   mode: null,
16:45:01.658   topicId: '',
16:45:01.658   shouldWrap: false
16:45:01.658 }
16:45:01.658 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:01.658 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:01.776 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:01.776   assignmentId: null,
16:45:01.776   activityId: null,
16:45:01.776   mode: null,
16:45:01.776   topicId: '',
16:45:01.776   shouldWrap: false
16:45:01.776 }
16:45:01.776 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:01.776 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:02.189 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:02.189   assignmentId: null,
16:45:02.189   activityId: null,
16:45:02.189   mode: null,
16:45:02.189   topicId: '',
16:45:02.189   shouldWrap: false
16:45:02.189 }
16:45:02.189 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:02.189 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:02.275 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:02.275   assignmentId: null,
16:45:02.275   activityId: null,
16:45:02.275   mode: null,
16:45:02.275   topicId: '',
16:45:02.275   shouldWrap: false
16:45:02.275 }
16:45:02.275 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:02.275 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:02.608 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:02.608   assignmentId: null,
16:45:02.608   activityId: null,
16:45:02.608   mode: null,
16:45:02.608   topicId: '',
16:45:02.608   shouldWrap: false
16:45:02.608 }
16:45:02.608 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:02.608 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:02.730 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:02.731   assignmentId: null,
16:45:02.731   activityId: null,
16:45:02.731   mode: null,
16:45:02.731   topicId: '',
16:45:02.731   shouldWrap: false
16:45:02.731 }
16:45:02.731 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:02.731 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:02.796 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:02.796   assignmentId: null,
16:45:02.796   activityId: null,
16:45:02.796   mode: null,
16:45:02.796   topicId: '',
16:45:02.796   shouldWrap: false
16:45:02.796 }
16:45:02.796 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:02.796 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.141 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.141   assignmentId: null,
16:45:03.141   activityId: null,
16:45:03.142   mode: null,
16:45:03.142   topicId: '',
16:45:03.142   shouldWrap: false
16:45:03.142 }
16:45:03.142 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.142 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.283 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.283   assignmentId: null,
16:45:03.283   activityId: null,
16:45:03.283   mode: null,
16:45:03.283   topicId: '',
16:45:03.283   shouldWrap: false
16:45:03.283 }
16:45:03.283 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.283 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.305 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.305   assignmentId: null,
16:45:03.305   activityId: null,
16:45:03.305   mode: null,
16:45:03.305   topicId: '',
16:45:03.306   shouldWrap: false
16:45:03.306 }
16:45:03.306 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.306 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.640 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.640   assignmentId: null,
16:45:03.640   activityId: null,
16:45:03.640   mode: null,
16:45:03.640   topicId: '',
16:45:03.640   shouldWrap: false
16:45:03.640 }
16:45:03.640 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.640 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.784 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.784   assignmentId: null,
16:45:03.784   activityId: null,
16:45:03.784   mode: null,
16:45:03.785   topicId: '',
16:45:03.785   shouldWrap: false
16:45:03.785 }
16:45:03.785 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.785 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:03.798 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:03.798   assignmentId: null,
16:45:03.798   activityId: null,
16:45:03.798   mode: null,
16:45:03.798   topicId: '',
16:45:03.798   shouldWrap: false
16:45:03.798 }
16:45:03.798 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:03.798 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.196 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.196   assignmentId: null,
16:45:04.196   activityId: null,
16:45:04.196   mode: null,
16:45:04.196   topicId: '',
16:45:04.196   shouldWrap: false
16:45:04.197 }
16:45:04.197 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.197 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.295 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.295   assignmentId: null,
16:45:04.295   activityId: null,
16:45:04.295   mode: null,
16:45:04.295   topicId: '',
16:45:04.295   shouldWrap: false
16:45:04.295 }
16:45:04.295 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.295 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.337 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.337   assignmentId: null,
16:45:04.337   activityId: null,
16:45:04.337   mode: null,
16:45:04.337   topicId: '',
16:45:04.337   shouldWrap: false
16:45:04.337 }
16:45:04.337 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.338 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.725 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.725   assignmentId: null,
16:45:04.725   activityId: null,
16:45:04.725   mode: null,
16:45:04.725   topicId: '',
16:45:04.725   shouldWrap: false
16:45:04.725 }
16:45:04.725 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.728 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.842 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.842   assignmentId: null,
16:45:04.842   activityId: null,
16:45:04.842   mode: null,
16:45:04.842   topicId: '',
16:45:04.842   shouldWrap: false
16:45:04.842 }
16:45:04.842 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.842 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:04.885 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:04.885   assignmentId: null,
16:45:04.885   activityId: null,
16:45:04.885   mode: null,
16:45:04.885   topicId: '',
16:45:04.885   shouldWrap: false
16:45:04.886 }
16:45:04.886 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:04.886 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.267 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.267   assignmentId: null,
16:45:05.267   activityId: null,
16:45:05.267   mode: null,
16:45:05.267   topicId: '',
16:45:05.267   shouldWrap: false
16:45:05.267 }
16:45:05.267 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.267 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.373 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.374   assignmentId: null,
16:45:05.374   activityId: null,
16:45:05.374   mode: null,
16:45:05.374   topicId: '',
16:45:05.374   shouldWrap: false
16:45:05.374 }
16:45:05.374 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.374 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.396 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.396   assignmentId: null,
16:45:05.396   activityId: null,
16:45:05.396   mode: null,
16:45:05.396   topicId: '',
16:45:05.396   shouldWrap: false
16:45:05.396 }
16:45:05.396 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.396 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.758 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.758   assignmentId: null,
16:45:05.758   activityId: null,
16:45:05.758   mode: null,
16:45:05.758   topicId: '',
16:45:05.758   shouldWrap: false
16:45:05.758 }
16:45:05.758 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.758 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.883 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.883   assignmentId: null,
16:45:05.883   activityId: null,
16:45:05.883   mode: null,
16:45:05.884   topicId: '',
16:45:05.884   shouldWrap: false
16:45:05.884 }
16:45:05.884 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.884 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:05.922 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:05.922   assignmentId: null,
16:45:05.922   activityId: null,
16:45:05.922   mode: null,
16:45:05.922   topicId: '',
16:45:05.923   shouldWrap: false
16:45:05.923 }
16:45:05.923 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:05.923 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.235 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.235   assignmentId: null,
16:45:06.235   activityId: null,
16:45:06.235   mode: null,
16:45:06.235   topicId: '',
16:45:06.235   shouldWrap: false
16:45:06.235 }
16:45:06.236 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.236 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.369 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.369   assignmentId: null,
16:45:06.369   activityId: null,
16:45:06.369   mode: null,
16:45:06.369   topicId: '',
16:45:06.370   shouldWrap: false
16:45:06.370 }
16:45:06.370 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.370 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.434 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.434   assignmentId: null,
16:45:06.434   activityId: null,
16:45:06.434   mode: null,
16:45:06.434   topicId: '',
16:45:06.434   shouldWrap: false
16:45:06.434 }
16:45:06.435 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.435 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.744 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.745   assignmentId: null,
16:45:06.745   activityId: null,
16:45:06.745   mode: null,
16:45:06.745   topicId: '',
16:45:06.745   shouldWrap: false
16:45:06.745 }
16:45:06.745 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.745 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.866 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.866   assignmentId: null,
16:45:06.866   activityId: null,
16:45:06.866   mode: null,
16:45:06.866   topicId: '',
16:45:06.866   shouldWrap: false
16:45:06.866 }
16:45:06.866 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.866 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:06.928 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:06.928   assignmentId: null,
16:45:06.928   activityId: null,
16:45:06.928   mode: null,
16:45:06.928   topicId: '',
16:45:06.928   shouldWrap: false
16:45:06.929 }
16:45:06.929 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:06.929 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.241 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.241   assignmentId: null,
16:45:07.241   activityId: null,
16:45:07.241   mode: null,
16:45:07.241   topicId: '',
16:45:07.241   shouldWrap: false
16:45:07.241 }
16:45:07.241 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.241 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.373 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.373   assignmentId: null,
16:45:07.373   activityId: null,
16:45:07.373   mode: null,
16:45:07.373   topicId: '',
16:45:07.373   shouldWrap: false
16:45:07.373 }
16:45:07.373 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.373 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.442 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.442   assignmentId: null,
16:45:07.442   activityId: null,
16:45:07.442   mode: null,
16:45:07.442   topicId: '',
16:45:07.442   shouldWrap: false
16:45:07.442 }
16:45:07.442 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.442 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.885 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.885   assignmentId: null,
16:45:07.885   activityId: null,
16:45:07.885   mode: null,
16:45:07.885   topicId: '',
16:45:07.885   shouldWrap: false
16:45:07.885 }
16:45:07.885 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.885 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.887 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.887   assignmentId: null,
16:45:07.887   activityId: null,
16:45:07.887   mode: null,
16:45:07.887   topicId: '',
16:45:07.887   shouldWrap: false
16:45:07.887 }
16:45:07.887 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.887 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:07.963 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:07.963   assignmentId: null,
16:45:07.963   activityId: null,
16:45:07.963   mode: null,
16:45:07.963   topicId: '',
16:45:07.963   shouldWrap: false
16:45:07.963 }
16:45:07.963 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:07.963 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:08.392 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:08.392   assignmentId: null,
16:45:08.392   activityId: null,
16:45:08.392   mode: null,
16:45:08.392   topicId: '',
16:45:08.392   shouldWrap: false
16:45:08.392 }
16:45:08.392 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:08.393 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:08.398 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:08.398   assignmentId: null,
16:45:08.398   activityId: null,
16:45:08.398   mode: null,
16:45:08.398   topicId: '',
16:45:08.398   shouldWrap: false
16:45:08.398 }
16:45:08.398 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:08.398 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:08.452 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:08.452   assignmentId: null,
16:45:08.452   activityId: null,
16:45:08.452   mode: null,
16:45:08.452   topicId: '',
16:45:08.452   shouldWrap: false
16:45:08.452 }
16:45:08.452 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:08.452 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:08.944 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:08.944   assignmentId: null,
16:45:08.944   activityId: null,
16:45:08.944   mode: null,
16:45:08.944   topicId: '',
16:45:08.944   shouldWrap: false
16:45:08.945 }
16:45:08.945 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:08.945 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:08.969 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:08.969   assignmentId: null,
16:45:08.969   activityId: null,
16:45:08.969   mode: null,
16:45:08.969   topicId: '',
16:45:08.969   shouldWrap: false
16:45:08.969 }
16:45:08.969 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:08.969 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.074 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.074   assignmentId: null,
16:45:09.074   activityId: null,
16:45:09.074   mode: null,
16:45:09.074   topicId: '',
16:45:09.074   shouldWrap: false
16:45:09.074 }
16:45:09.074 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.074 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.446 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.446   assignmentId: null,
16:45:09.446   activityId: null,
16:45:09.446   mode: null,
16:45:09.446   topicId: '',
16:45:09.446   shouldWrap: false
16:45:09.446 }
16:45:09.446 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.446 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.456 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.456   assignmentId: null,
16:45:09.456   activityId: null,
16:45:09.456   mode: null,
16:45:09.456   topicId: '',
16:45:09.456   shouldWrap: false
16:45:09.456 }
16:45:09.456 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.457 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.605 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.605   assignmentId: null,
16:45:09.605   activityId: null,
16:45:09.605   mode: null,
16:45:09.605   topicId: '',
16:45:09.605   shouldWrap: false
16:45:09.605 }
16:45:09.605 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.605 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.928 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.929   assignmentId: null,
16:45:09.929   activityId: null,
16:45:09.929   mode: null,
16:45:09.929   topicId: '',
16:45:09.929   shouldWrap: false
16:45:09.929 }
16:45:09.929 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.929 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:09.956 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:09.956   assignmentId: null,
16:45:09.956   activityId: null,
16:45:09.956   mode: null,
16:45:09.956   topicId: '',
16:45:09.957   shouldWrap: false
16:45:09.957 }
16:45:09.957 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:09.957 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.089 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.089   assignmentId: null,
16:45:10.089   activityId: null,
16:45:10.089   mode: null,
16:45:10.089   topicId: '',
16:45:10.089   shouldWrap: false
16:45:10.090 }
16:45:10.090 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.090 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.440 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.440   assignmentId: null,
16:45:10.440   activityId: null,
16:45:10.440   mode: null,
16:45:10.440   topicId: '',
16:45:10.441   shouldWrap: false
16:45:10.441 }
16:45:10.441 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.441 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.472 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.473   assignmentId: null,
16:45:10.473   activityId: null,
16:45:10.473   mode: null,
16:45:10.473   topicId: '',
16:45:10.473   shouldWrap: false
16:45:10.473 }
16:45:10.473 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.473 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.598 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.598   assignmentId: null,
16:45:10.598   activityId: null,
16:45:10.598   mode: null,
16:45:10.599   topicId: '',
16:45:10.599   shouldWrap: false
16:45:10.599 }
16:45:10.599 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.599 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.949 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.949   assignmentId: null,
16:45:10.949   activityId: null,
16:45:10.949   mode: null,
16:45:10.949   topicId: '',
16:45:10.949   shouldWrap: false
16:45:10.949 }
16:45:10.949 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.949 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:10.957 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:10.957   assignmentId: null,
16:45:10.958   activityId: null,
16:45:10.958   mode: null,
16:45:10.958   topicId: '',
16:45:10.958   shouldWrap: false
16:45:10.958 }
16:45:10.958 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:10.958 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.092 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.092   assignmentId: null,
16:45:11.092   activityId: null,
16:45:11.092   mode: null,
16:45:11.093   topicId: '',
16:45:11.093   shouldWrap: false
16:45:11.093 }
16:45:11.093 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.093 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.422 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.422   assignmentId: null,
16:45:11.422   activityId: null,
16:45:11.422   mode: null,
16:45:11.423   topicId: '',
16:45:11.423   shouldWrap: false
16:45:11.423 }
16:45:11.423 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.423 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.471 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.471   assignmentId: null,
16:45:11.471   activityId: null,
16:45:11.471   mode: null,
16:45:11.471   topicId: '',
16:45:11.471   shouldWrap: false
16:45:11.471 }
16:45:11.471 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.471 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.664 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.664   assignmentId: null,
16:45:11.664   activityId: null,
16:45:11.664   mode: null,
16:45:11.664   topicId: '',
16:45:11.664   shouldWrap: false
16:45:11.664 }
16:45:11.664 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.664 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.924 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.924   assignmentId: null,
16:45:11.924   activityId: null,
16:45:11.924   mode: null,
16:45:11.924   topicId: '',
16:45:11.924   shouldWrap: false
16:45:11.924 }
16:45:11.924 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.924 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:11.969 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:11.969   assignmentId: null,
16:45:11.969   activityId: null,
16:45:11.969   mode: null,
16:45:11.969   topicId: '',
16:45:11.969   shouldWrap: false
16:45:11.969 }
16:45:11.969 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:11.969 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.152 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.152   assignmentId: null,
16:45:12.152   activityId: null,
16:45:12.152   mode: null,
16:45:12.152   topicId: '',
16:45:12.152   shouldWrap: false
16:45:12.152 }
16:45:12.152 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.153 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.470 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.470   assignmentId: null,
16:45:12.470   activityId: null,
16:45:12.470   mode: null,
16:45:12.470   topicId: '',
16:45:12.470   shouldWrap: false
16:45:12.470 }
16:45:12.470 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.470 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.488 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.488   assignmentId: null,
16:45:12.489   activityId: null,
16:45:12.489   mode: null,
16:45:12.489   topicId: '',
16:45:12.489   shouldWrap: false
16:45:12.489 }
16:45:12.489 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.490 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.648 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.648   assignmentId: null,
16:45:12.648   activityId: null,
16:45:12.648   mode: null,
16:45:12.648   topicId: '',
16:45:12.648   shouldWrap: false
16:45:12.648 }
16:45:12.648 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.648 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.972 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.972   assignmentId: null,
16:45:12.972   activityId: null,
16:45:12.972   mode: null,
16:45:12.972   topicId: '',
16:45:12.972   shouldWrap: false
16:45:12.972 }
16:45:12.972 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.972 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:12.972 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:12.972   assignmentId: null,
16:45:12.972   activityId: null,
16:45:12.972   mode: null,
16:45:12.972   topicId: '',
16:45:12.972   shouldWrap: false
16:45:12.972 }
16:45:12.972 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:12.972 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.170 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.170   assignmentId: null,
16:45:13.170   activityId: null,
16:45:13.170   mode: null,
16:45:13.170   topicId: '',
16:45:13.170   shouldWrap: false
16:45:13.170 }
16:45:13.170 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.170 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.462 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.462   assignmentId: null,
16:45:13.462   activityId: null,
16:45:13.462   mode: null,
16:45:13.462   topicId: '',
16:45:13.462   shouldWrap: false
16:45:13.462 }
16:45:13.462 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.462 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.472 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.472   assignmentId: null,
16:45:13.472   activityId: null,
16:45:13.472   mode: null,
16:45:13.472   topicId: '',
16:45:13.472   shouldWrap: false
16:45:13.472 }
16:45:13.472 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.472 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.697 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.697   assignmentId: null,
16:45:13.697   activityId: null,
16:45:13.697   mode: null,
16:45:13.697   topicId: '',
16:45:13.697   shouldWrap: false
16:45:13.697 }
16:45:13.697 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.697 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.960 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.960   assignmentId: null,
16:45:13.960   activityId: null,
16:45:13.960   mode: null,
16:45:13.960   topicId: '',
16:45:13.960   shouldWrap: false
16:45:13.960 }
16:45:13.961 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.961 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:13.963 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:13.963   assignmentId: null,
16:45:13.963   activityId: null,
16:45:13.963   mode: null,
16:45:13.963   topicId: '',
16:45:13.963   shouldWrap: false
16:45:13.963 }
16:45:13.963 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:13.963 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:14.224 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:14.225   assignmentId: null,
16:45:14.225   activityId: null,
16:45:14.225   mode: null,
16:45:14.225   topicId: '',
16:45:14.225   shouldWrap: false
16:45:14.225 }
16:45:14.225 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:14.225 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:14.460 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:14.460   assignmentId: null,
16:45:14.460   activityId: null,
16:45:14.460   mode: null,
16:45:14.460   topicId: '',
16:45:14.460   shouldWrap: false
16:45:14.460 }
16:45:14.460 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:14.460 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:14.479 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:14.479   assignmentId: null,
16:45:14.479   activityId: null,
16:45:14.479   mode: null,
16:45:14.479   topicId: '',
16:45:14.479   shouldWrap: false
16:45:14.479 }
16:45:14.479 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:14.479 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:14.748 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:14.748   assignmentId: null,
16:45:14.748   activityId: null,
16:45:14.748   mode: null,
16:45:14.748   topicId: '',
16:45:14.748   shouldWrap: false
16:45:14.748 }
16:45:14.748 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:14.748 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:14.960 🎯 [CLIENT WRAPPER] Checking assignment mode: {
16:45:14.961   assignmentId: null,
16:45:14.961   activityId: null,
16:45:14.961   mode: null,
16:45:14.961   topicId: '',
16:45:14.961   shouldWrap: false
16:45:14.961 }
16:45:14.961 ❌ [CLIENT WRAPPER] No assignment mode, rendering normally
16:45:14.961 📄 [PAGE CONTENT] Rendering with assignment mode: false
16:45:15.020 🎯 [VOCAB DASHBOARD PAGE] Page component loaded!
16:45:15.022 🎯 [VOCAB DASHBOARD PAGE] Page component loaded!
16:45:15.378 Flashcards imports successful: { Flashcards: 'function', useAuth: 'function' }
16:45:15.415  ✓ Generating static pages (810/810)
16:45:15.481    Finalizing page optimization ...
16:45:15.482    Collecting build traces ...
16:45:15.490 
16:45:15.529 Route (app)                                                                   Size     First Load JS
16:45:15.530 ┌ ○ /                                                                         13.2 kB         363 kB
16:45:15.530 ├ ○ /_not-found                                                               883 B          88.7 kB
16:45:15.530 ├ ○ /about                                                                    191 B           102 kB
16:45:15.530 ├ ○ /account                                                                  5.92 kB         151 kB
16:45:15.530 ├ ○ /account/orders                                                           3.34 kB         149 kB
16:45:15.530 ├ ○ /account/school                                                           5.38 kB         151 kB
16:45:15.530 ├ ○ /account/settings                                                         3.83 kB         149 kB
16:45:15.530 ├ ○ /account/upgrade                                                          9.18 kB         155 kB
16:45:15.530 ├ ○ /activities                                                               10 kB           385 kB
16:45:15.530 ├ ○ /activities/case-file-translator                                          16.7 kB         244 kB
16:45:15.530 ├ ƒ /activities/case-file-translator/assignment/[assignmentId]                689 B           137 kB
16:45:15.530 ├ ○ /activities/conjugation-duel                                              38.4 kB         242 kB
16:45:15.530 ├ ƒ /activities/conjugation-duel/assignment/[assignmentId]                    681 B           137 kB
16:45:15.530 ├ ○ /activities/detective-listening                                           5.8 kB          256 kB
16:45:15.530 ├ ƒ /activities/detective-listening/assignment/[assignmentId]                 8.81 kB         239 kB
16:45:15.530 ├ ○ /activities/hangman                                                       11.1 kB         274 kB
16:45:15.530 ├ ƒ /activities/hangman/assignment/[assignmentId]                             673 B           137 kB
16:45:15.530 ├ ○ /activities/lava-temple-word-restore                                      12.3 kB         245 kB
16:45:15.530 ├ ƒ /activities/lava-temple-word-restore/assignment/[assignmentId]            692 B           137 kB
16:45:15.530 ├ ○ /activities/memory-game                                                   26.6 kB         267 kB
16:45:15.530 ├ ƒ /activities/memory-game/assignment/[assignmentId]                         681 B           137 kB
16:45:15.530 ├ ○ /activities/multi-game                                                    4.89 kB         187 kB
16:45:15.530 ├ ○ /activities/noughts-and-crosses                                           7.29 kB         265 kB
16:45:15.530 ├ ƒ /activities/noughts-and-crosses/assignment/[assignmentId]                 9.8 kB          233 kB
16:45:15.531 ├ ○ /activities/sentence-towers                                               18.2 kB         244 kB
16:45:15.531 ├ ƒ /activities/sentence-towers/assignment/[assignmentId]                     681 B           137 kB
16:45:15.531 ├ ○ /activities/speed-builder                                                 7.95 kB         261 kB
16:45:15.531 ├ ƒ /activities/speed-builder/assignment/[assignmentId]                       681 B           137 kB
16:45:15.531 ├ ○ /activities/verb-quest                                                    27.5 kB         237 kB
16:45:15.531 ├ ○ /activities/vocab-blast                                                   8.92 kB         261 kB
16:45:15.531 ├ ƒ /activities/vocab-blast/assignment/[assignmentId]                         8.52 kB         230 kB
16:45:15.531 ├ ƒ /activities/vocab-master                                                  233 B            88 kB
16:45:15.531 ├ ƒ /activities/vocab-master/assignment/[assignmentId]                        6.55 kB         238 kB
16:45:15.531 ├ ○ /activities/vocabulary-mining                                             24.5 kB         259 kB
16:45:15.531 ├ ○ /activities/vocabulary-test                                               4.26 kB         145 kB
16:45:15.531 ├ ○ /activities/word-blast                                                    21.9 kB         269 kB
16:45:15.531 ├ ƒ /activities/word-blast/assignment/[assignmentId]                          678 B           137 kB
16:45:15.531 ├ ○ /activities/word-scramble                                                 6.52 kB         246 kB
16:45:15.531 ├ ƒ /activities/word-scramble/assignment/[assignmentId]                       7.57 kB         217 kB
16:45:15.531 ├ ○ /activities/word-towers                                                   247 B           259 kB
16:45:15.531 ├ ƒ /activities/word-towers/assignment/[assignmentId]                         896 B           260 kB
16:45:15.531 ├ ○ /admin                                                                    3.85 kB         149 kB
16:45:15.531 ├ ○ /admin/assessment-preview                                                 2.42 kB         136 kB
16:45:15.531 ├ ○ /admin/audio-generation                                                   3.45 kB         128 kB
16:45:15.531 ├ ○ /admin/blog                                                               5.84 kB         151 kB
16:45:15.531 ├ ○ /admin/blog/new                                                           4.07 kB         271 kB
16:45:15.531 ├ ○ /admin/freebies                                                           8.64 kB         154 kB
16:45:15.531 ├ ○ /admin/grammar/edit                                                       3.07 kB         136 kB
16:45:15.531 ├ ○ /admin/new                                                                7.66 kB         144 kB
16:45:15.531 ├ ○ /admin/products                                                           4.21 kB         141 kB
16:45:15.531 ├ ○ /admin/videos                                                             19.5 kB         230 kB
16:45:15.531 ├ ○ /admin/vocabulary                                                         27.8 kB         201 kB
16:45:15.531 ├ ○ /admin/worksheet-preview                                                  1.27 kB        89.1 kB
16:45:15.531 ├ ○ /admin/worksheets                                                         4.09 kB        91.9 kB
16:45:15.531 ├ ƒ /api/admin/aqa-listening/create                                           0 B                0 B
16:45:15.531 ├ ƒ /api/admin/aqa-listening/delete                                           0 B                0 B
16:45:15.531 ├ ƒ /api/admin/aqa-listening/get/[id]                                         0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-listening/list                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-listening/update                                           0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/create                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/delete                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/get-next-identifier                                0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/get/[paperId]                                      0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/list                                               0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-reading/update                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/create                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/delete                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/get-next-identifier                                0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/get/[paperId]                                      0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/list                                               0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/update                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/aqa-writing/upload-photo                                       0 B                0 B
16:45:15.532 ├ ƒ /api/admin/backfill-leaderboards                                          0 B                0 B
16:45:15.532 ├ ƒ /api/admin/delete-account                                                 0 B                0 B
16:45:15.532 ├ ƒ /api/admin/generate-audio                                                 0 B                0 B
16:45:15.532 ├ ƒ /api/admin/generate-gemini-audio                                          0 B                0 B
16:45:15.532 ├ ƒ /api/admin/generate/worksheet                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/generate/worksheet/print                                       0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/pages/create                                           0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/pages/update                                           0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/revalidate                                             0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/test/update                                            0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/topics/create                                          0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/topics/delete                                          0 B                0 B
16:45:15.532 ├ ƒ /api/admin/grammar/update                                                 0 B                0 B
16:45:15.532 ├ ƒ /api/admin/migrate-users                                                  0 B                0 B
16:45:15.532 ├ ƒ /api/admin/populate-grammar                                               0 B                0 B
16:45:15.532 ├ ƒ /api/admin/reading-comprehension/create                                   0 B                0 B
16:45:15.532 ├ ƒ /api/admin/reading-comprehension/delete                                   0 B                0 B
16:45:15.533 ├ ƒ /api/admin/reading-comprehension/update                                   0 B                0 B
16:45:15.533 ├ ƒ /api/admin/video-content                                                  0 B                0 B
16:45:15.533 ├ ○ /api/admin/vocabulary-template                                            0 B                0 B
16:45:15.533 ├ ƒ /api/ai-insights                                                          0 B                0 B
16:45:15.533 ├ ƒ /api/ai-insights/pipeline                                                 0 B                0 B
16:45:15.533 ├ ƒ /api/ai/generate-crossword-words                                          0 B                0 B
16:45:15.533 ├ ƒ /api/ai/generate-word-search-words                                        0 B                0 B
16:45:15.533 ├ ƒ /api/analytics/gem-collector                                              0 B                0 B
16:45:15.533 ├ ƒ /api/analytics/gem-collector/export                                       0 B                0 B
16:45:15.533 ├ ƒ /api/assessments/availability                                             0 B                0 B
16:45:15.533 ├ ƒ /api/assessments/grade-writing                                            0 B                0 B
16:45:15.533 ├ ƒ /api/assessments/manual-override                                          0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/mark                                                     0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/question-details                                         0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/reading/generate                                         0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/reading/override                                         0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/reading/results                                          0 B                0 B
16:45:15.534 ├ ƒ /api/assessments/regrade                                                  0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/[assignmentId]                                           0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/[assignmentId]/games/[gameId]/evaluate-completion        0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/[assignmentId]/progress                                  0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/[assignmentId]/vocabulary                                0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/[assignmentId]/win-conditions                            0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/create                                                   0 B                0 B
16:45:15.534 ├ ƒ /api/assignments/progress                                                 0 B                0 B
16:45:15.534 ├ ƒ /api/auth                                                                 0 B                0 B
16:45:15.534 ├ ƒ /api/auth/accept-invitation                                               0 B                0 B
16:45:15.534 ├ ƒ /api/auth/callback                                                        0 B                0 B
16:45:15.534 ├ ƒ /api/auth/check-user                                                      0 B                0 B
16:45:15.534 ├ ƒ /api/auth/config-check                                                    0 B                0 B
16:45:15.534 ├ ƒ /api/auth/cross-domain                                                    0 B                0 B
16:45:15.534 ├ ƒ /api/auth/request-password-reset                                          0 B                0 B
16:45:15.534 ├ ƒ /api/auth/resend-verification                                             0 B                0 B
16:45:15.534 ├ ƒ /api/auth/signup                                                          0 B                0 B
16:45:15.534 ├ ƒ /api/auth/signup-learner                                                  0 B                0 B
16:45:15.534 ├ ƒ /api/auth/student-login                                                   0 B                0 B
16:45:15.534 ├ ƒ /api/beta/email-capture                                                   0 B                0 B
16:45:15.534 ├ ƒ /api/beta/feedback                                                        0 B                0 B
16:45:15.534 ├ ƒ /api/blog/generate-content                                                0 B                0 B
16:45:15.534 ├ ƒ /api/blog/publish-now                                                     0 B                0 B
16:45:15.534 ├ ƒ /api/blog/publish-scheduled                                               0 B                0 B
16:45:15.534 ├ ƒ /api/blog/schedule                                                        0 B                0 B
16:45:15.534 ├ ƒ /api/blog/send-notifications                                              0 B                0 B
16:45:15.534 ├ ƒ /api/blog/subscribe                                                       0 B                0 B
16:45:15.534 ├ ƒ /api/blog/update                                                          0 B                0 B
16:45:15.534 ├ ƒ /api/brevo/webhook                                                        0 B                0 B
16:45:15.535 ├ ƒ /api/chatbot                                                              0 B                0 B
16:45:15.535 ├ ƒ /api/classes/school-filtered                                              0 B                0 B
16:45:15.535 ├ ƒ /api/contact                                                              0 B                0 B
16:45:15.535 ├ ƒ /api/cron/expire-trials                                                   0 B                0 B
16:45:15.535 ├ ƒ /api/curriculum/vocabulary                                                0 B                0 B
16:45:15.535 ├ ƒ /api/dashboard/assignment-analytics/[assignmentId]                        0 B                0 B
16:45:15.535 ├ ƒ /api/dashboard/leaderboards                                               0 B                0 B
16:45:15.535 ├ ƒ /api/dashboard/vocabulary/analytics                                       0 B                0 B
16:45:15.535 ├ ƒ /api/dashboard/vocabulary/proficiency                                     0 B                0 B
16:45:15.535 ├ ƒ /api/debug-responses                                                      0 B                0 B
16:45:15.535 ├ ƒ /api/debug-translation                                                    0 B                0 B
16:45:15.535 ├ ○ /api/debug-vocab                                                          0 B                0 B
16:45:15.535 ├ ƒ /api/debug/vocabulary-mining-data                                         0 B                0 B
16:45:15.535 ├ ƒ /api/dictation/assessments                                                0 B                0 B
16:45:15.535 ├ ƒ /api/dictation/assessments/[id]                                           0 B                0 B
16:45:15.535 ├ ƒ /api/dictation/assessments/[id]/questions                                 0 B                0 B
16:45:15.535 ├ ƒ /api/dictation/questions                                                  0 B                0 B
16:45:15.535 ├ ƒ /api/download/free-resource/[orderId]                                     0 B                0 B
16:45:15.535 ├ ƒ /api/four-skills-assessment/results                                       0 B                0 B
16:45:15.535 ├ ƒ /api/free-resources/capture                                               0 B                0 B
16:45:15.535 ├ ƒ /api/games/buffer-flush                                                   0 B                0 B
16:45:15.535 ├ ƒ /api/games/detective-listening                                            0 B                0 B
16:45:15.535 ├ ƒ /api/games/gem-collector/sentences                                        0 B                0 B
16:45:15.535 ├ ƒ /api/games/gem-collector/sessions                                         0 B                0 B
16:45:15.535 ├ ƒ /api/games/speed-builder/sentences                                        0 B                0 B
16:45:15.535 ├ ƒ /api/games/speed-builder/sessions                                         0 B                0 B
16:45:15.535 ├ ƒ /api/games/speed-builder/unified-sentences                                0 B                0 B
16:45:15.535 ├ ƒ /api/games/word-blast/sentences                                           0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/batch-generate-all-content                                   0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/batch-generate-tests                                         0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/content                                                      0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/discover-topics                                              0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/generate-test-content                                        0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/practice-status                                              0 B                0 B
16:45:15.535 ├ ƒ /api/grammar/progress                                                     0 B                0 B
16:45:15.536 ├ ƒ /api/grammar/quiz-questions                                               0 B                0 B
16:45:15.536 ├ ƒ /api/grammar/topics                                                       0 B                0 B
16:45:15.536 ├ ƒ /api/learner/progress                                                     0 B                0 B
16:45:15.536 ├ ƒ /api/orders/[orderId]                                                     0 B                0 B
16:45:15.536 ├ ƒ /api/orders/[orderId]/download/[productId]                                0 B                0 B
16:45:15.536 ├ ƒ /api/orders/by-session/[sessionId]                                        0 B                0 B
16:45:15.536 ├ ƒ /api/orders/create-free-order                                             0 B                0 B
16:45:15.536 ├ ƒ /api/orders/resend-email                                                  0 B                0 B
16:45:15.536 ├ ○ /api/products                                                             0 B                0 B
16:45:15.536 ├ ƒ /api/products/download                                                    0 B                0 B
16:45:15.536 ├ ○ /api/products/free                                                        0 B                0 B
16:45:15.536 ├ ○ /api/reading-comprehension/categories                                     0 B                0 B
16:45:15.536 ├ ƒ /api/reading-comprehension/results                                        0 B                0 B
16:45:15.536 ├ ƒ /api/reading-comprehension/tasks                                          0 B                0 B
16:45:15.536 ├ ƒ /api/resources/curriculum                                                 0 B                0 B
16:45:15.536 ├ ƒ /api/resources/download                                                   0 B                0 B
16:45:15.536 ├ ƒ /api/resources/resources                                                  0 B                0 B
16:45:15.536 ├ ƒ /api/revalidate                                                           0 B                0 B
16:45:15.536 ├ ƒ /api/save-session                                                         0 B                0 B
16:45:15.536 ├ ƒ /api/school-codes/suggestions                                             0 B                0 B
16:45:15.536 ├ ƒ /api/school/invite-teacher                                                0 B                0 B
16:45:15.536 ├ ƒ /api/school/members                                                       0 B                0 B
16:45:15.536 ├ ○ /api/sentences/categories                                                 0 B                0 B
16:45:15.536 ├ ○ /api/sentences/subcategories                                              0 B                0 B
16:45:15.536 ├ ƒ /api/sentry-example-api                                                   0 B                0 B
16:45:15.536 ├ ƒ /api/speaking/assess                                                      0 B                0 B
16:45:15.536 ├ ƒ /api/speaking/transcribe                                                  0 B                0 B
16:45:15.536 ├ ƒ /api/speaking/tts                                                         0 B                0 B
16:45:15.536 ├ ƒ /api/stripe/create-checkout-session                                       0 B                0 B
16:45:15.536 ├ ƒ /api/stripe/create-product                                                0 B                0 B
16:45:15.537 ├ ƒ /api/stripe/debug                                                         0 B                0 B
16:45:15.537 ├ ƒ /api/stripe/webhook                                                       0 B                0 B
16:45:15.537 ├ ƒ /api/student/vocabulary-analytics                                         0 B                0 B
16:45:15.537 ├ ƒ /api/student/weak-words-analysis                                          0 B                0 B
16:45:15.537 ├ ƒ /api/student/weak-words-analysis-simple                                   0 B                0 B
16:45:15.537 ├ ƒ /api/students/bulk                                                        0 B                0 B
16:45:15.537 ├ ƒ /api/students/credentials                                                 0 B                0 B
16:45:15.537 ├ ƒ /api/students/delete                                                      0 B                0 B
16:45:15.537 ├ ƒ /api/students/fix-credentials                                             0 B                0 B
16:45:15.537 ├ ƒ /api/students/password                                                    0 B                0 B
16:45:15.537 ├ ƒ /api/students/reset-password                                              0 B                0 B
16:45:15.537 ├ ƒ /api/students/update-passwords                                            0 B                0 B
16:45:15.537 ├ ƒ /api/teacher-analytics/assignment-analysis                                0 B                0 B
16:45:15.537 ├ ƒ /api/teacher-analytics/assignment-simple                                  0 B                0 B
16:45:15.537 ├ ƒ /api/teacher-analytics/class-summary                                      0 B                0 B
16:45:15.537 ├ ƒ /api/teacher-analytics/multi-class-overview                               0 B                0 B
16:45:15.537 ├ ƒ /api/teacher-analytics/student-profile                                    0 B                0 B
16:45:15.537 ├ ƒ /api/teacher/grammar-assignment-analytics/[assignmentId]                  0 B                0 B
16:45:15.537 ├ ƒ /api/teacher/grammar-assignment-analytics/[assignmentId]/ai-insights      0 B                0 B
16:45:15.537 ├ ƒ /api/teacher/override-history                                             0 B                0 B
16:45:15.537 ├ ƒ /api/teacher/override-score                                               0 B                0 B
16:45:15.538 ├ ƒ /api/test-email                                                           0 B                0 B
16:45:15.538 ├ ○ /api/test-listening-service                                               0 B                0 B
16:45:15.538 ├ ƒ /api/test-vocabulary                                                      0 B                0 B
16:45:15.538 ├ ƒ /api/test/create-test-purchase                                            0 B                0 B
16:45:15.538 ├ ƒ /api/topic-assessments                                                    0 B                0 B
16:45:15.538 ├ ƒ /api/topic-assessments/[id]                                               0 B                0 B
16:45:15.538 ├ ƒ /api/topic-assessments/[id]/questions                                     0 B                0 B
16:45:15.538 ├ ƒ /api/trial/start                                                          0 B                0 B
16:45:15.538 ├ ƒ /api/upload/image                                                         0 B                0 B
16:45:15.538 ├ ƒ /api/user/profile                                                         0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary                                                           0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary-tests/[testId]/start                                      0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary-tests/[testId]/submit                                     0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary-tests/create                                              0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary/categories                                                0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary/categorize                                                0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary/languages                                                 0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary/preview                                                   0 B                0 B
16:45:15.538 ├ ƒ /api/vocabulary/stats                                                     0 B                0 B
16:45:15.539 ├ ƒ /api/vocabulary/words                                                     0 B                0 B
16:45:15.539 ├ ƒ /api/word-search/generate                                                 0 B                0 B
16:45:15.539 ├ ƒ /api/word-search/save                                                     0 B                0 B
16:45:15.539 ├ ƒ /api/workbooks/generate-aqa-spanish                                       0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/[id]/download                                             0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/cache/clear                                               0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/generate                                                  0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/generate-html                                             0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/generate-pdf                                              0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/generate-sentence-builder                                 0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/progress/[jobId]                                          0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/public                                                    0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/sentence-builder/[id]                                     0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/sentence-builder/[id]/pdf                                 0 B                0 B
16:45:15.539 ├ ƒ /api/worksheets/track-download                                            0 B                0 B
16:45:15.539 ├ ○ /aqa-french-gcse                                                          351 B          96.9 kB
16:45:15.539 ├ ○ /aqa-german-gcse                                                          351 B          96.9 kB
16:45:15.539 ├ ○ /aqa-listening-test                                                       622 B          88.4 kB
16:45:15.539 ├ ƒ /aqa-listening-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]  6.68 kB         144 kB
16:45:15.539 ├ ƒ /aqa-listening-test/[language]/[tier]/[paper]                             3.6 kB          155 kB
16:45:15.539 ├ ○ /aqa-listening-test/demo2                                                 2.74 kB         154 kB
16:45:15.539 ├ ƒ /aqa-reading-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]    2.33 kB         146 kB
16:45:15.539 ├ ƒ /aqa-reading-test/[language]/[tier]/[paper]                               3.38 kB         152 kB
16:45:15.539 ├ ○ /aqa-reading-test/foundation                                              1.48 kB        89.3 kB
16:45:15.539 ├ ƒ /aqa-reading-test/french/[tier]                                           233 B            88 kB
16:45:15.539 ├ ƒ /aqa-reading-test/french/[tier]/[paper]                                   233 B            88 kB
16:45:15.539 ├ ƒ /aqa-reading-test/german/[tier]/[paper]                                   233 B            88 kB
16:45:15.539 ├ ○ /aqa-reading-test/higher                                                  613 B          88.4 kB
16:45:15.539 ├ ƒ /aqa-reading-test/spanish/[tier]                                          233 B            88 kB
16:45:15.539 ├ ƒ /aqa-reading-test/spanish/[tier]/[paper]                                  233 B            88 kB
16:45:15.539 ├ ○ /aqa-spanish-gcse                                                         351 B          96.9 kB
16:45:15.539 ├ ○ /aqa-speaking-test                                                        18.1 kB         196 kB
16:45:15.539 ├ ○ /aqa-writing-test                                                         620 B          88.4 kB
16:45:15.539 ├ ƒ /aqa-writing-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]    5.8 kB          144 kB
16:45:15.539 ├ ƒ /aqa-writing-test/[language]/[tier]/[paper]                               3.01 kB         154 kB
16:45:15.539 ├ ○ /assessments                                                              2.7 kB          119 kB
16:45:15.540 ├ ○ /assessments/aqa-listening                                                2.18 kB         145 kB
16:45:15.540 ├ ○ /assessments/aqa-reading                                                  1.99 kB         142 kB
16:45:15.540 ├ ƒ /assessments/assignment/[assignmentId]                                    3.8 kB          140 kB
16:45:15.540 ├ ○ /assessments/dictation                                                    3.54 kB         165 kB
16:45:15.540 ├ ○ /assessments/four-skills                                                  671 B          88.5 kB
16:45:15.540 ├ ○ /assessments/gcse-listening                                               15.1 kB         195 kB
16:45:15.540 ├ ○ /assessments/gcse-reading                                                 18.1 kB         206 kB
16:45:15.540 ├ ○ /assessments/gcse-speaking                                                2.76 kB        99.3 kB
16:45:15.540 ├ ○ /assessments/gcse-writing                                                 21.3 kB         193 kB
16:45:15.540 ├ ○ /assessments/reading-comprehension                                        4.38 kB         164 kB
16:45:15.540 ├ ○ /assessments/topic-based                                                  2.88 kB         169 kB
16:45:15.540 ├ ○ /auth/confirmed                                                           1.73 kB        98.3 kB
16:45:15.540 ├ ○ /auth/forgot-password                                                     2.27 kB        98.8 kB
16:45:15.540 ├ ○ /auth/login                                                               4.12 kB         137 kB
16:45:15.540 ├ ○ /auth/login-learner                                                       3.8 kB          189 kB
16:45:15.540 ├ ○ /auth/login-teacher                                                       4 kB            189 kB
16:45:15.540 ├ ○ /auth/reset-password                                                      3.2 kB          149 kB
16:45:15.540 ├ ○ /auth/signup                                                              5.58 kB         187 kB
16:45:15.540 ├ ○ /auth/signup-learner                                                      3.9 kB          186 kB
16:45:15.540 ├ ○ /auth/student-login                                                       4.36 kB         189 kB
16:45:15.540 ├ ○ /auth/verify-email                                                        2.48 kB          99 kB
16:45:15.540 ├ ƒ /blog                                                                     6.29 kB         152 kB
16:45:15.540 ├ ƒ /blog/[slug]                                                              7.19 kB         225 kB
16:45:15.540 ├ ○ /blog/aqa-gcse-speaking-photocard-guide                                   350 B          96.9 kB
16:45:15.540 ├ ○ /blog/best-vocabulary-learning-techniques-gcse                            147 B           100 kB
16:45:15.540 ├ ○ /blog/complete-guide-gcse-spanish-vocabulary-themes                       350 B          96.9 kB
16:45:15.540 ├ ○ /blog/complete-guide-spaced-repetition-vocabulary-learning                351 B          96.9 kB
16:45:15.540 ├ ○ /blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam         351 B          96.9 kB
16:45:15.540 ├ ○ /blog/gamification-language-learning-classroom                            351 B          96.9 kB
16:45:15.540 ├ ○ /blog/gcse-german-writing-exam-tips                                       3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/gcse-spanish-speaking-exam-tips                                     3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/german-cases-explained-simple-guide                                 3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/german-movies-tv-shows-listening-skills                             3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/imparfait-vs-passe-compose-simple-guide                             3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/jouer-a-vs-jouer-de-explained                                       351 B          96.9 kB
16:45:15.540 ├ ○ /blog/ks3-french-word-blast-game-better-than-flashcards                   3.04 kB        99.6 kB
16:45:15.540 ├ ○ /blog/language-learning-apps-vs-educational-software                      351 B          96.9 kB
16:45:15.541 ├ ○ /blog/por-vs-para-guide                                                   351 B          96.9 kB
16:45:15.541 ├ ○ /blog/pronunciation-in-the-reading-aloud-task                             351 B          96.9 kB
16:45:15.541 ├ ○ /blog/science-of-gamification-language-learning                           147 B           100 kB
16:45:15.541 ├ ○ /blog/ser-vs-estar-ultimate-guide-students                                3.04 kB        99.6 kB
16:45:15.541 ├ ○ /blog/spaced-repetition-vs-cramming                                       3.04 kB        99.6 kB
16:45:15.541 ├ ○ /blog/spanish-90-word-response-tonics-formula                             3.04 kB        99.6 kB
16:45:15.541 ├ ○ /blog/top-tips-gcse-writing-six-pillars                                   351 B          96.9 kB
16:45:15.541 ├ ○ /cart                                                                     7.17 kB         160 kB
16:45:15.541 ├ ○ /challenges/daily                                                         584 B          88.4 kB
16:45:15.541 ├ ○ /checkout/success                                                         4.17 kB         101 kB
16:45:15.541 ├ ○ /community                                                                351 B          96.9 kB
16:45:15.541 ├ ○ /contact                                                                  6.04 kB         103 kB
16:45:15.541 ├ ○ /contact-sales                                                            7.72 kB         104 kB
16:45:15.541 ├ ○ /cookies                                                                  350 B          96.9 kB
16:45:15.541 ├ ƒ /dashboard                                                                6.91 kB         152 kB
16:45:15.541 ├ ƒ /dashboard/achievements                                                   3.5 kB          149 kB
16:45:15.541 ├ ƒ /dashboard/admin/migrate                                                  3.86 kB        99.5 kB
16:45:15.541 ├ ƒ /dashboard/analytics                                                      5.93 kB         553 kB
16:45:15.541 ├ ƒ /dashboard/analytics/cross-game                                           5.06 kB         150 kB
16:45:15.541 ├ ƒ /dashboard/analytics/gem-collector                                        4.29 kB         236 kB
16:45:15.541 ├ ƒ /dashboard/assessments                                                    3.37 kB         163 kB
16:45:15.541 ├ ƒ /dashboard/assessments/[id]/analytics                                     17.5 kB         184 kB
16:45:15.541 ├ ƒ /dashboard/assessments/new                                                4.65 kB         196 kB
16:45:15.541 ├ ƒ /dashboard/assignments                                                    3.83 kB         163 kB
16:45:15.541 ├ ƒ /dashboard/assignments/[assignmentId]/edit                                3.96 kB         149 kB
16:45:15.541 ├ ƒ /dashboard/assignments/[assignmentId]/preview                             1.2 kB           89 kB
16:45:15.541 ├ ƒ /dashboard/assignments/new                                                36.9 kB         248 kB
16:45:15.541 ├ ƒ /dashboard/assignments/new/exam                                           3 kB           99.5 kB
16:45:15.541 ├ ƒ /dashboard/classes                                                        5.09 kB         150 kB
16:45:15.541 ├ ƒ /dashboard/classes/[classId]                                              141 kB          721 kB
16:45:15.541 ├ ƒ /dashboard/classes/[classId]/edit                                         5.87 kB         159 kB
16:45:15.541 ├ ƒ /dashboard/classes/[classId]/vocabulary-analytics                         4.63 kB         146 kB
16:45:15.541 ├ ƒ /dashboard/content                                                        565 B          88.4 kB
16:45:15.541 ├ ƒ /dashboard/content/create                                                 572 B          88.4 kB
16:45:15.541 ├ ƒ /dashboard/content/import                                                 3.71 kB         140 kB
16:45:15.541 ├ ƒ /dashboard/content/speed-builder                                          6.92 kB         185 kB
16:45:15.541 ├ ƒ /dashboard/content/speed-builder/bulk-upload                              4.59 kB         183 kB
16:45:15.542 ├ ƒ /dashboard/games                                                          5.18 kB         151 kB
16:45:15.542 ├ ƒ /dashboard/grammar/analytics                                              2.4 kB          188 kB
16:45:15.542 ├ ƒ /dashboard/home                                                           3.36 kB         149 kB
16:45:15.542 ├ ƒ /dashboard/leaderboards                                                   6.67 kB         159 kB
16:45:15.542 ├ ƒ /dashboard/overview                                                       3.58 kB         144 kB
16:45:15.542 ├ ƒ /dashboard/preview                                                        5.13 kB         151 kB
16:45:15.542 ├ ƒ /dashboard/progress                                                       3.14 kB         144 kB
16:45:15.542 ├ ƒ /dashboard/progress/assignment/[assignmentId]                             16 kB           207 kB
16:45:15.542 ├ ƒ /dashboard/progress/student/[studentId]                                   3.46 kB        91.3 kB
16:45:15.542 ├ ƒ /dashboard/reports                                                        4.57 kB         150 kB
16:45:15.542 ├ ƒ /dashboard/settings                                                       2.88 kB         140 kB
16:45:15.542 ├ ƒ /dashboard/students                                                       4.61 kB         150 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary                                                     10 kB           159 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-mining                                              5.06 kB         155 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-mining/controls                                     5.54 kB         151 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-mining/curriculum                                   6.17 kB         152 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-mining/curriculum/[id]/coverage                     3.43 kB         154 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-mining/reports                                      1.37 kB         138 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary-tests                                               16.2 kB         193 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary/[listId]                                            4.49 kB         150 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary/analytics                                           3.87 kB         552 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary/create                                              5.41 kB         151 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary/proficiency-test                                    1.78 kB         135 kB
16:45:15.542 ├ ƒ /dashboard/vocabulary/school-lists                                        6.81 kB         189 kB
16:45:15.542 ├ ○ /debug/sentence-config                                                    1.51 kB        89.3 kB
16:45:15.542 ├ ○ /demo                                                                     8.95 kB         148 kB
16:45:15.542 ├ ○ /demo/student-dashboard                                                   15 kB           263 kB
16:45:15.542 ├ ○ /demo/teacher-dashboard                                                   22.9 kB         277 kB
16:45:15.542 ├ ○ /diagnostics                                                              3.18 kB          91 kB
16:45:15.542 ├ ○ /dictation                                                                7.61 kB         153 kB
16:45:15.542 ├ ƒ /dictation/[language]/[tier]/[paper]                                      1.84 kB         155 kB
16:45:15.542 ├ ○ /documentation                                                            6.58 kB         103 kB
16:45:15.542 ├ ƒ /download/[sessionId]                                                     3.32 kB         141 kB
16:45:15.542 ├ ƒ /download/resource/[resourceId]                                           0 B                0 B
16:45:15.542 ├ ○ /edexcel-french-gcse                                                      351 B          96.9 kB
16:45:15.543 ├ ○ /edexcel-german-gcse                                                      351 B          96.9 kB
16:45:15.543 ├ ○ /edexcel-listening-test                                                   626 B          88.4 kB
16:45:15.543 ├ ƒ /edexcel-listening-test/[language]/[tier]/[paper]                         4.31 kB         158 kB
16:45:15.543 ├ ○ /edexcel-spanish-gcse                                                     351 B          96.9 kB
16:45:15.543 ├ ○ /exam-style-assessment-topic                                              12 kB           157 kB
16:45:15.543 ├ ○ /exam-style-assessment/task                                               928 B          88.7 kB
16:45:15.543 ├ ○ /exams                                                                    1.93 kB         104 kB
16:45:15.543 ├ ƒ /exams/[examBoard]                                                        1.28 kB        89.1 kB
16:45:15.543 ├ ƒ /exams/[examBoard]/[level]                                                1.75 kB        89.6 kB
16:45:15.543 ├ ƒ /exams/[examBoard]/[level]/[theme]                                        1.68 kB        89.5 kB
16:45:15.543 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]                                1.78 kB        89.6 kB
16:45:15.543 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]/reading                        3.75 kB        91.6 kB
16:45:15.543 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]/vocabulary                     3.31 kB        91.1 kB
16:45:15.543 ├ ○ /exams/aqa/ks4_gcse/listening                                             5.42 kB         102 kB
16:45:15.543 ├ ○ /exams/aqa/ks4_gcse/speaking                                              6.3 kB          103 kB
16:45:15.543 ├ ○ /exams/aqa/ks4_gcse/writing                                               5.89 kB         108 kB
16:45:15.543 ├ ○ /exams/specification                                                      3.77 kB         100 kB
16:45:15.543 ├ ○ /explore                                                                  351 B          96.9 kB
16:45:15.543 ├ ○ /features                                                                 350 B          96.9 kB
16:45:15.543 ├ ○ /four-skills-assessment                                                   4.16 kB          92 kB
16:45:15.543 ├ ○ /four-skills-assessment/test                                              9.35 kB         155 kB
16:45:15.543 ├ ○ /free-resources                                                           6.83 kB         160 kB
16:45:15.543 ├ ○ /gcse-french-learning                                                     351 B          96.9 kB
16:45:15.543 ├ ○ /gcse-german-learning                                                     351 B          96.9 kB
16:45:15.543 ├ ○ /gcse-language-learning                                                   351 B          96.9 kB
16:45:15.543 ├ ○ /gcse-spanish-learning                                                    351 B          96.9 kB
16:45:15.543 ├ ○ /grammar                                                                  7.01 kB         160 kB
16:45:15.543 ├ ƒ /grammar/[language]                                                       5.07 kB         187 kB
16:45:15.543 ├ ƒ /grammar/[language]/[category]                                            233 B            88 kB
16:45:15.543 ├ ● /grammar/[language]/[category]/[topic]                                    6.36 kB         204 kB
16:45:15.543 ├   ├ /grammar/french/adjectives/agreement-rules
16:45:15.543 ├   ├ /grammar/french/adjectives/comparative
16:45:15.543 ├   ├ /grammar/french/adjectives/demonstrative
16:45:15.544 ├   └ [+288 more paths]
16:45:15.544 ├ ƒ /grammar/[language]/[category]/[topic]/challenge                          5.37 kB         187 kB
16:45:15.544 ├ ƒ /grammar/[language]/[category]/[topic]/practice                           7.72 kB         206 kB
16:45:15.544 ├ ƒ /grammar/[language]/[category]/[topic]/test                               3.12 kB         202 kB
16:45:15.544 ├ ○ /grammar/french                                                           4.99 kB         138 kB
16:45:15.544 ├ ○ /grammar/french/adjectives/agreement-rules/quiz                           1.66 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/adjectives/comparison/quiz                                1.65 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/adjectives/placement/quiz                                 1.65 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/adverbs/formation/quiz                                    1.65 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/nouns/articles/quiz                                       1.64 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/nouns/gender/quiz                                         1.65 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/pronouns/object/quiz                                      1.65 kB         193 kB
16:45:15.544 ├ ○ /grammar/french/pronouns/subject/quiz                                     1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/french/verbs/future-tense/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/french/verbs/imparfait/quiz                                      1.64 kB         193 kB
16:45:15.545 ├ ○ /grammar/french/verbs/passe-compose/quiz                                  1.66 kB         193 kB
16:45:15.545 ├ ○ /grammar/french/verbs/present-tense/quiz                                  1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german                                                           4.97 kB         138 kB
16:45:15.545 ├ ○ /grammar/german/adjectives/comparison/quiz                                1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/adjectives/endings/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ƒ /grammar/german/adverbs/formation                                         221 B           190 kB
16:45:15.545 ├ ○ /grammar/german/cases/accusative/quiz                                     1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/cases/dative/quiz                                         1.64 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/cases/genitive/quiz                                       1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/cases/nominative/quiz                                     1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/nouns/compound-nouns                                      221 B           190 kB
16:45:15.545 ├ ○ /grammar/german/nouns/declension                                          221 B           190 kB
16:45:15.545 ├ ○ /grammar/german/nouns/gender/quiz                                         1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/nouns/plurals/quiz                                        1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/nouns/weak-nouns                                          221 B           190 kB
16:45:15.545 ├ ○ /grammar/german/pronouns/personal/quiz                                    1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/verbs/future-tense/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/verbs/past-tense/quiz                                     1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/german/verbs/present-tense/quiz                                  1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish                                                          8.86 kB         191 kB
16:45:15.545 ├ ○ /grammar/spanish/adjectives/agreement/quiz                                1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/adjectives/comparison/quiz                               1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/adjectives/demonstrative/quiz                            1.66 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/adjectives/possessive/quiz                               1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/adverbs/formation/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/adverbs/placement/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/articles/definite/quiz                                   1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/articles/indefinite/quiz                                 1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/nouns/gender/quiz                                        1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/nouns/plurals/quiz                                       1.65 kB         193 kB
16:45:15.545 ├ ○ /grammar/spanish/prepositions/common/quiz                                 1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/pronouns/object/quiz                                     1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/pronouns/reflexive/quiz                                  1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/pronouns/subject/quiz                                    1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/conditional/quiz                                   1.64 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/future-tense/quiz                                  1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/imperfect-tense/quiz                               1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/present-tense/quiz                                 1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/preterite-tense/quiz                               1.65 kB         193 kB
16:45:15.546 ├ ○ /grammar/spanish/verbs/ser-vs-estar/quiz                                  1.65 kB         193 kB
16:45:15.546 ├ ○ /help                                                                     3.84 kB         137 kB
16:45:15.546 ├ ○ /help-center                                                              6.2 kB          103 kB
16:45:15.546 ├ ○ /help/getting-started                                                     5.11 kB         138 kB
16:45:15.546 ├ ○ /learner-dashboard                                                        5.8 kB          188 kB
16:45:15.546 ├ ○ /learner-dashboard/challenges                                             3.83 kB         186 kB
16:45:15.546 ├ ○ /learner-dashboard/progress                                               4.49 kB         186 kB
16:45:15.546 ├ ○ /learner-dashboard/upgrade                                                4.33 kB         186 kB
16:45:15.546 ├ ○ /learner-dashboard/vocabulary                                             4.96 kB         187 kB
16:45:15.546 ├ ○ /learners                                                                 7 kB            189 kB
16:45:15.546 ├ ○ /legal/accessibility                                                      352 B          96.9 kB
16:45:15.546 ├ ○ /legal/ai-policy                                                          351 B          96.9 kB
16:45:15.546 ├ ○ /legal/disclaimer                                                         351 B          96.9 kB
16:45:15.546 ├ ○ /legal/gdpr                                                               351 B          96.9 kB
16:45:15.546 ├ ○ /links                                                                    3.2 kB          136 kB
16:45:15.546 ├ ○ /mobile-analytics                                                         2.18 kB         352 kB
16:45:15.546 ├ ○ /mobile-analytics-detail                                                  4.14 kB         345 kB
16:45:15.546 ├ ƒ /mobile-assignment/[assignmentId]                                         2.79 kB         344 kB
16:45:15.546 ├ ○ /mobile-assignments                                                       2.95 kB         344 kB
16:45:15.546 ├ ƒ /mobile-class/[classId]                                                   2.72 kB         353 kB
16:45:15.546 ├ ○ /mobile-classes                                                           3.04 kB         353 kB
16:45:15.546 ├ ○ /mobile-games                                                             7.15 kB         348 kB
16:45:15.546 ├ ○ /mobile-games/hangman                                                     7.82 kB         399 kB
16:45:15.547 ├ ○ /mobile-games/memory-match                                                12.6 kB         171 kB
16:45:15.547 ├ ○ /mobile-games/sentence-towers                                             5.48 kB         347 kB
16:45:15.547 ├ ○ /mobile-games/speed-builder                                               5.89 kB         399 kB
16:45:15.547 ├ ○ /mobile-games/verb-quest                                                  6.55 kB         348 kB
16:45:15.547 ├ ○ /mobile-games/vocab-blast                                                 5.56 kB         381 kB
16:45:15.547 ├ ○ /mobile-games/vocab-master                                                10.8 kB         425 kB
16:45:15.547 ├ ○ /mobile-games/word-scramble                                               6.64 kB         374 kB
16:45:15.547 ├ ○ /mobile-games/word-towers                                                 3.37 kB         262 kB
16:45:15.547 ├ ○ /mobile-grammar                                                           1.97 kB         352 kB
16:45:15.547 ├ ○ /mobile-home                                                              3.45 kB         348 kB
16:45:15.547 ├ ○ /mobile-profile                                                           3.06 kB         344 kB
16:45:15.547 ├ ○ /mobile-progress                                                          4.62 kB         358 kB
16:45:15.547 ├ ○ /mobile-teacher-assignments                                               2.65 kB         353 kB
16:45:15.547 ├ ○ /mobile-teacher-home                                                      3.22 kB         353 kB
16:45:15.547 ├ ○ /offline                                                                  1.51 kB        89.3 kB
16:45:15.547 ├ ○ /pricing                                                                  5.01 kB         138 kB
16:45:15.547 ├ ○ /privacy                                                                  351 B          96.9 kB
16:45:15.547 ├ ƒ /product/[slug]                                                           9.23 kB         166 kB
16:45:15.547 ├ ○ /reading-comprehension                                                    10.4 kB         156 kB
16:45:15.547 ├ ƒ /reading-comprehension/[language]/[category]/[subcategory]                12.9 kB         109 kB
16:45:15.547 ├ ○ /reading-comprehension/task                                               1.29 kB         144 kB
16:45:15.547 ├ ○ /resources                                                                10 kB           166 kB
16:45:15.547 ├ ƒ /resources/[language]                                                     3.15 kB        99.7 kB
16:45:15.547 ├ ƒ /resources/[language]/[keyStage]                                          6.65 kB         103 kB
16:45:15.547 ├ ● /resources/[language]/[keyStage]/[topic]                                  2.71 kB         159 kB
16:45:15.547 ├   ├ /resources/spanish/ks3/basics-core-language
16:45:15.547 ├   ├ /resources/spanish/ks3/identity-personal-life
16:45:15.547 ├   ├ /resources/spanish/ks3/home-local-area
16:45:15.547 ├   └ [+75 more paths]
16:45:15.547 ├ ○ /resources/skills                                                         815 B          97.3 kB
16:45:15.547 ├ ○ /resources/skills/french                                                  816 B          97.3 kB
16:45:15.547 ├ ○ /resources/skills/french/exam-practice                                    816 B          97.3 kB
16:45:15.547 ├ ○ /resources/skills/french/grammar                                          816 B          97.3 kB
16:45:15.547 ├ ○ /resources/skills/french/vocabulary                                       351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/french/vocabulary/frequency-packs                       351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/french/vocabulary/games                                 351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/french/vocabulary/vocab-booklets                        350 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/french/vocabulary/word-lists                            351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/german                                                  816 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/german/exam-practice                                    816 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/german/grammar                                          816 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/german/vocabulary                                       351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/german/vocabulary/frequency-packs                       349 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/german/vocabulary/games                                 351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/german/vocabulary/vocab-booklets                        351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/german/vocabulary/word-lists                            351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/spanish                                                 816 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/spanish/exam-practice                                   815 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/spanish/grammar                                         816 B          97.3 kB
16:45:15.548 ├ ○ /resources/skills/spanish/vocabulary                                      350 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/spanish/vocabulary/frequency-packs                      351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/spanish/vocabulary/games                                351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/spanish/vocabulary/vocab-booklets                       351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/spanish/vocabulary/word-lists                           351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/speaking                                                351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/vocabulary/frequency-packs                              351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/vocabulary/games                                        233 B            88 kB
16:45:15.548 ├ ○ /resources/skills/vocabulary/vocab-booklets                               351 B          96.9 kB
16:45:15.548 ├ ○ /resources/skills/vocabulary/word-lists                                   351 B          96.9 kB
16:45:15.548 ├ ○ /resources/teachers                                                       351 B          96.9 kB
16:45:15.548 ├ ○ /resources/topics                                                         817 B          97.3 kB
16:45:15.548 ├ ○ /schools                                                                  14.1 kB         201 kB
16:45:15.548 ├ ○ /schools/pricing                                                          351 B          96.9 kB
16:45:15.548 ├ ○ /sentry-example-page                                                      8.1 kB         99.6 kB
16:45:15.548 ├ ○ /sitemap                                                                  351 B          96.9 kB
16:45:15.548 ├ ○ /sitemap.xml                                                              0 B                0 B
16:45:15.548 ├ ○ /songs                                                                    4.41 kB         186 kB
16:45:15.548 ├ ƒ /songs/[language]                                                         7.68 kB         218 kB
16:45:15.549 ├ ƒ /songs/[language]/video/[id]                                              19.7 kB         220 kB
16:45:15.549 ├ ○ /student                                                                  5.6 kB          187 kB
16:45:15.549 ├ ○ /student-dashboard                                                        24.7 kB         210 kB
16:45:15.549 ├ ○ /student-dashboard/activities                                             16.6 kB         210 kB
16:45:15.549 ├ ƒ /student-dashboard/activities/[gameId]                                    1.93 kB         139 kB
16:45:15.549 ├ ○ /student-dashboard/activities/vocab-master                                1.36 kB         138 kB
16:45:15.549 ├ ○ /student-dashboard/assessments                                            5.86 kB         188 kB
16:45:15.549 ├ ○ /student-dashboard/assessments-redirect                                   533 B          88.3 kB
16:45:15.549 ├ ƒ /student-dashboard/assessments/[id]                                       7.08 kB         170 kB
16:45:15.549 ├ ○ /student-dashboard/assignments                                            7.31 kB         161 kB
16:45:15.549 ├ ƒ /student-dashboard/assignments/[assignmentId]                             17.2 kB         173 kB
16:45:15.549 ├ ○ /student-dashboard/exam-prep                                              548 B          88.4 kB
16:45:15.549 ├ ○ /student-dashboard/grammar                                                658 B          88.5 kB
16:45:15.549 ├ ○ /student-dashboard/grammar/analytics                                      8.76 kB         145 kB
16:45:15.549 ├ ○ /student-dashboard/leaderboard                                            1.92 kB         145 kB
16:45:15.549 ├ ○ /student-dashboard/preview                                                4.89 kB         150 kB
16:45:15.549 ├ ○ /student-dashboard/vocabmaster                                            700 B          88.5 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary                                             6.52 kB         152 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary-mining                                      5.15 kB         155 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary-mining/collection                           5.33 kB         192 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary-mining/practice                             8.53 kB         159 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary-mining/progress                             3.6 kB          154 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary-mining/review                               3.84 kB         154 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/analysis                                    9.55 kB         191 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/categories                                  4.64 kB         186 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/dashboard                                   9.5 kB          183 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/detail                                      4.32 kB         177 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/practice                                    6.42 kB         188 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/progress                                    3.55 kB         177 kB
16:45:15.549 ├ ○ /student-dashboard/vocabulary/review                                      4.28 kB         177 kB
16:45:15.549 ├ ○ /student/auth/login                                                       6.17 kB         188 kB
16:45:15.549 ├ ○ /student/dashboard                                                        700 B           137 kB
16:45:15.550 ├ ƒ /student/test/[testId]                                                    7.18 kB         184 kB
16:45:15.550 ├ ƒ /student/test/[testId]/results                                            4.71 kB         178 kB
16:45:15.550 ├ ƒ /student/test/[testId]/review                                             3.76 kB         177 kB
16:45:15.550 ├ ○ /teacher-dashboard/analytics/reading-comprehension                        3.51 kB         140 kB
16:45:15.550 ├ ○ /terms                                                                    350 B          96.9 kB
16:45:15.550 ├ ○ /test-ai                                                                  2.14 kB        89.9 kB
16:45:15.550 ├ ○ /test-brevo                                                               1.04 kB        88.8 kB
16:45:15.550 ├ ○ /test-generators                                                          3.35 kB          99 kB
16:45:15.550 ├ ○ /test-listening-client                                                    1.57 kB         138 kB
16:45:15.550 ├ ○ /tools/crossword                                                          15.4 kB         154 kB
16:45:15.550 ├ ○ /tools/crossword/result                                                   4.04 kB         116 kB
16:45:15.550 ├ ○ /tools/crossword/test                                                     3.8 kB          107 kB
16:45:15.550 ├ ○ /tools/wordsearch                                                         22.5 kB         118 kB
16:45:15.550 ├ ○ /tutorials                                                                6.32 kB         103 kB
16:45:15.550 ├ ○ /vocab-master                                                             12.9 kB         261 kB
16:45:15.550 ├ ƒ /vocab-master/assignment/[assignmentId]                                   680 B           234 kB
16:45:15.550 ├ ƒ /vocabulary/edit/[id]                                                     2.29 kB         150 kB
16:45:15.550 ├ ○ /vocabulary/new                                                           1.82 kB         149 kB
16:45:15.550 ├ ○ /workbooks/aqa-spanish                                                    2.76 kB        90.6 kB
16:45:15.550 ├ ○ /worksheets                                                               8.63 kB         174 kB
16:45:15.550 ├ ƒ /worksheets/[id]                                                          23 kB           274 kB
16:45:15.551 ├ ○ /worksheets/builder                                                       8.34 kB         145 kB
16:45:15.551 ├ ○ /worksheets/create                                                        5.81 kB         110 kB
16:45:15.551 ├ ○ /worksheets/create/crossword                                              553 B          88.4 kB
16:45:15.551 ├ ○ /worksheets/create/grammar-exercises                                      12.8 kB         120 kB
16:45:15.551 ├ ○ /worksheets/create/listening-comprehension                                7.6 kB          112 kB
16:45:15.551 ├ ○ /worksheets/create/mixed-practice                                         8.51 kB         116 kB
16:45:15.551 ├ ○ /worksheets/create/reading-comprehension                                  9.24 kB         166 kB
16:45:15.551 ├ ○ /worksheets/create/sentence-builder                                       13.2 kB         160 kB
16:45:15.551 ├ ○ /worksheets/create/sentence-builder/result                                8.17 kB         113 kB
16:45:15.551 ├ ○ /worksheets/create/vocabulary-practice                                    8.47 kB         165 kB
16:45:15.551 ├ ○ /worksheets/create/word-search                                            9.56 kB         166 kB
16:45:15.551 ├ ○ /worksheets/create/word-search/result                                     6.88 kB         111 kB
16:45:15.551 ├ ○ /worksheets/create/writing-practice                                       7.62 kB         112 kB
16:45:15.551 ├ ○ /worksheets/my-worksheets                                                 2.85 kB         136 kB
16:45:15.551 ├ ○ /worksheets/public                                                        8.77 kB         158 kB
16:45:15.551 ├ ƒ /worksheets/sentence-builder/[id]                                         8.74 kB         113 kB
16:45:15.551 ├ ○ /youtube/flashcards                                                       894 B           179 kB
16:45:15.551 ├ ƒ /youtube/video/[id]                                                       7.64 kB         197 kB
16:45:15.552 ├ ○ /youtube/videos                                                           6.44 kB         196 kB
16:45:15.552 ├ ○ /youtube/vocabulary                                                       3.1 kB          140 kB
16:45:15.552 ├ ƒ /youtube/youtube-quiz/[id]                                                3.93 kB         152 kB
16:45:15.552 └ ○ /youtube/youtube-videos                                                   2.3 kB          148 kB
16:45:15.552 + First Load JS shared by all                                                 87.8 kB
16:45:15.552   ├ chunks/52117-0bf109c7d8431721.js                                          31.8 kB
16:45:15.552   ├ chunks/fd9d1056-9dfda1883548923a.js                                       53.6 kB
16:45:15.552   └ other shared chunks (total)                                               2.41 kB
16:45:15.552 
16:45:15.552 
16:45:15.552 ƒ Middleware                                                                  63.1 kB
16:45:15.552 
16:45:15.552 ○  (Static)   prerendered as static content
16:45:15.552 ●  (SSG)      prerendered as static HTML (uses getStaticProps)
16:45:15.552 ƒ  (Dynamic)  server-rendered on demand
16:45:15.552 
16:45:16.848 Traced Next.js server files in: 46.831ms
16:45:18.767 Created all serverless functions in: 1.919s
16:45:19.115 Collected static files (public/, static/, .next/static): 179.497ms
16:45:21.750 Build Completed in /vercel/output [5m]
16:45:22.838 Deploying outputs...
16:45:43.871 Deployment completed
16:45:45.655 Creating build cache...
16:46:10.809 Created build cache: 25.153s
16:46:10.809 Uploading build cache [722.31 MB]
16:46:20.051 Build cache uploaded: 9.242s