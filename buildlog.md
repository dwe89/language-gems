14:40:11.322 Running build in Washington, D.C., USA (East) – iad1
14:40:11.323 Build machine configuration: 4 cores, 8 GB
14:40:11.444 Cloning github.com/dwe89/language-gems (Branch: main, Commit: e39b164)
14:40:26.604 Warning: Failed to fetch one or more git submodules
14:40:26.605 Cloning completed: 15.161s
14:40:27.257 Restored build cache from previous deployment (AXVHf59tQyxysT6GDoLVduzhqufx)
14:40:28.535 Running "vercel build"
14:40:28.960 Vercel CLI 50.1.3
14:40:29.559 Running "install" command: `npm install`...
14:40:38.723 
14:40:38.723 up to date, audited 1359 packages in 9s
14:40:38.723 
14:40:38.723 343 packages are looking for funding
14:40:38.723   run `npm fund` for details
14:40:38.827 
14:40:38.828 17 vulnerabilities (7 moderate, 10 high)
14:40:38.828 
14:40:38.828 To address issues that do not require attention, run:
14:40:38.828   npm audit fix
14:40:38.828 
14:40:38.828 To address all issues (including breaking changes), run:
14:40:38.829   npm audit fix --force
14:40:38.829 
14:40:38.829 Run `npm audit` for details.
14:40:38.872 Detected Next.js version: 14.2.31
14:40:38.872 Running "next build"
14:40:39.571   ▲ Next.js 14.2.31
14:40:39.571   - Experiments (use with caution):
14:40:39.571     · proxyTimeout
14:40:39.571 
14:40:39.699    Creating an optimized production build ...
14:42:50.327 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
14:43:52.751  ⚠ Compiled with warnings
14:43:52.751 
14:43:52.752 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.752 Critical dependency: the request of a dependency is an expression
14:43:52.752 
14:43:52.752 Import trace for requested module:
14:43:52.752 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.752 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
14:43:52.752 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
14:43:52.752 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/index.js
14:43:52.752 ./node_modules/@prisma/instrumentation/dist/index.js
14:43:52.753 ./node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js
14:43:52.753 ./node_modules/@sentry/node/build/cjs/index.js
14:43:52.753 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
14:43:52.753 ./src/app/global-error.tsx
14:43:52.753 
14:43:52.753 ./node_modules/require-in-the-middle/index.js
14:43:52.753 Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
14:43:52.753 
14:43:52.753 Import trace for requested module:
14:43:52.753 ./node_modules/require-in-the-middle/index.js
14:43:52.753 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.753 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
14:43:52.754 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
14:43:52.754 ./node_modules/@opentelemetry/instrumentation/build/esm/index.js
14:43:52.754 ./node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js
14:43:52.754 ./node_modules/@sentry/node/build/cjs/index.js
14:43:52.754 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
14:43:52.754 ./src/app/global-error.tsx
14:43:52.754 
14:43:52.754 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.754 Critical dependency: the request of a dependency is an expression
14:43:52.754 
14:43:52.754 Import trace for requested module:
14:43:52.754 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.754 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
14:43:52.755 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
14:43:52.755 ./node_modules/@prisma/instrumentation/node_modules/@opentelemetry/instrumentation/build/esm/index.js
14:43:52.755 ./node_modules/@prisma/instrumentation/dist/index.js
14:43:52.755 ./node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js
14:43:52.755 ./node_modules/@sentry/node/build/cjs/index.js
14:43:52.755 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
14:43:52.755 ./src/app/layout.tsx
14:43:52.755 
14:43:52.755 ./node_modules/require-in-the-middle/index.js
14:43:52.755 Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
14:43:52.755 
14:43:52.755 Import trace for requested module:
14:43:52.755 ./node_modules/require-in-the-middle/index.js
14:43:52.755 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
14:43:52.755 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
14:43:52.756 ./node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
14:43:52.756 ./node_modules/@opentelemetry/instrumentation/build/esm/index.js
14:43:52.756 ./node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js
14:43:52.756 ./node_modules/@sentry/node/build/cjs/index.js
14:43:52.756 ./node_modules/@sentry/nextjs/build/cjs/index.server.js
14:43:52.756 ./src/app/layout.tsx
14:43:52.756 
14:43:52.756 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
14:43:52.756 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
14:43:52.756 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
14:43:52.756 
14:43:52.756 Import trace for requested module:
14:43:52.756 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
14:43:52.756 ./node_modules/@supabase/realtime-js/dist/module/index.js
14:43:52.756 ./node_modules/@supabase/supabase-js/dist/module/index.js
14:43:52.756 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
14:43:52.756 ./node_modules/@supabase/ssr/dist/module/index.js
14:43:52.757 ./src/utils/supabase/middleware.ts
14:43:52.757 
14:43:52.757 ./node_modules/@supabase/supabase-js/dist/module/index.js
14:43:52.757 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
14:43:52.757 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
14:43:52.757 
14:43:52.757 Import trace for requested module:
14:43:52.757 ./node_modules/@supabase/supabase-js/dist/module/index.js
14:43:52.757 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
14:43:52.757 ./node_modules/@supabase/ssr/dist/module/index.js
14:43:52.757 ./src/utils/supabase/middleware.ts
14:43:52.757 
14:43:52.757    Skipping validation of types
14:43:52.757    Skipping linting
14:43:53.078    Collecting page data ...
14:43:56.410 (node:933) NOTE: The AWS SDK for JavaScript (v2) is in maintenance mode.
14:43:56.411  SDK releases are limited to address critical bug fixes and security issues only.
14:43:56.411 
14:43:56.411 Please migrate your code to use AWS SDK for JavaScript (v3).
14:43:56.411 For more information, check the blog post at https://a.co/cUPnyil
14:43:56.411 (Use `node --trace-warnings ...` to show where the warning was created)
14:43:56.494 [Progress] Supabase client initialized successfully
14:44:04.232    Generating static pages (0/1058) ...
14:44:16.916 🔍 Testing vocabulary query: {
14:44:16.916   language: 'es',
14:44:16.916   curriculumLevel: 'KS4',
14:44:16.917   examBoard: 'AQA',
14:44:16.917   tier: 'higher',
14:44:16.917   limit: 10,
14:44:16.917   randomize: false,
14:44:16.917   themeName: 'Popular culture',
14:44:16.917   unitName: 'Free time activities'
14:44:16.918 }
14:44:16.918 🔍 CentralizedVocabularyService: Converting language "es" -> "es"
14:44:18.216 🔍 [API] Creating server-side Supabase client...
14:44:18.216 🔍 [API] Fetching products from server...
14:44:20.337 🔍 [API] Server response: { data: 1013, error: null }
14:44:20.338 ✅ [API] Successfully fetched 1013 products
14:44:21.380 Trial start error: B [Error]: Dynamic server usage: Route /api/trial/start couldn't be rendered statically because it used `nextUrl.searchParams`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
14:44:21.380     at V (/vercel/path0/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:21778)
14:44:21.380     at Object.get (/vercel/path0/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:29137)
14:44:21.380     at u (/vercel/path0/.next/server/app/api/trial/start/route.js:1:1091)
14:44:21.380     at /vercel/path0/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
14:44:21.380     at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:140:36
14:44:21.380     at NoopContextManager.with (/vercel/path0/node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js:25:19)
14:44:21.380     at ContextAPI.with (/vercel/path0/node_modules/@opentelemetry/api/build/src/api/context.js:60:46)
14:44:21.380     at NoopTracer.startActiveSpan (/vercel/path0/node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js:65:31)
14:44:21.380     at ProxyTracer.startActiveSpan (/vercel/path0/node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js:36:24)
14:44:21.381     at /vercel/path0/node_modules/next/dist/server/lib/trace/tracer.js:122:103 {
14:44:21.381   description: "Route /api/trial/start couldn't be rendered statically because it used `nextUrl.searchParams`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
14:44:21.381   digest: 'DYNAMIC_SERVER_USAGE'
14:44:21.381 }
14:44:21.382 Testing listening service...
14:44:21.590 Assessments found: [
14:44:21.590   {
14:44:21.590     id: '7461ad48-0ba5-4dde-90bf-bfe6786da792',
14:44:21.590     title: 'AQA Listening Assessment - Foundation Paper 1 (Spanish)',
14:44:21.591     description: 'Foundation level AQA-style Spanish listening assessment with audio generated by Gemini TTS',
14:44:21.591     level: 'foundation',
14:44:21.591     language: 'es',
14:44:21.591     identifier: 'paper-1',
14:44:21.591     version: '1.0',
14:44:21.592     total_questions: 8,
14:44:21.592     time_limit_minutes: 35,
14:44:21.592     created_by: null,
14:44:21.592     is_active: true,
14:44:21.592     created_at: '2025-07-29T21:35:20.611146+00:00',
14:44:21.592     updated_at: '2025-07-29T21:35:20.611146+00:00'
14:44:21.592   }
14:44:21.593 ]
14:44:21.705 Sitemap generated with 363 URLs (including 291 grammar pages)
14:44:21.733 Single assessment found: {
14:44:21.733   id: '7461ad48-0ba5-4dde-90bf-bfe6786da792',
14:44:21.733   title: 'AQA Listening Assessment - Foundation Paper 1 (Spanish)',
14:44:21.733   description: 'Foundation level AQA-style Spanish listening assessment with audio generated by Gemini TTS',
14:44:21.733   level: 'foundation',
14:44:21.733   language: 'es',
14:44:21.733   identifier: 'paper-1',
14:44:21.733   version: '1.0',
14:44:21.733   total_questions: 8,
14:44:21.734   time_limit_minutes: 35,
14:44:21.734   created_by: null,
14:44:21.734   is_active: true,
14:44:21.734   created_at: '2025-07-29T21:35:20.611146+00:00',
14:44:21.734   updated_at: '2025-07-29T21:35:20.611146+00:00'
14:44:21.734 }
14:44:21.880 Questions found: 8
14:44:33.894    Generating static pages (264/1058) 
14:44:35.962 🏗️ [FRENCH VERBS] Client component loaded with topics: 8
14:44:36.457 🏗️ [GERMAN CASES] Client component loaded with topics: 6
14:44:36.683 🏗️ [GERMAN VERBS] Client component loaded with topics: 8
14:44:36.812 🏗️ [GRAMMAR INDEX] Client component loaded
14:44:36.891 🏆 [ADJECTIVE AGREEMENT QUIZ] Page loaded, user: false
14:44:37.337 🏗️ [ARTICLES] Page loaded
14:44:37.513 🏆 [NOUN GENDER QUIZ] Page loaded, user: false
14:44:37.577 🏗️ [SPANISH NOUNS] Client component loaded with topics: 5
14:44:37.877 🏗️ [SPANISH PRONOUNS] Client component loaded with topics: 5
14:44:38.757 🏗️ [SPANISH VERBS] Client component loaded with topics: 8
14:44:39.189 🏗️ [PRETERITE] Page loaded
14:44:39.824    Generating static pages (528/1058) 
14:44:40.504 🏗️ [GRAMMAR INDEX] Client component loaded
14:44:43.995    Generating static pages (793/1058) 
14:44:45.140 🎯 [VOCAB DASHBOARD PAGE] Page component loaded!
14:44:45.141 🎯 [VOCAB DASHBOARD PAGE] Page component loaded!
14:44:45.486 Flashcards imports successful: { Flashcards: 'function', useAuth: 'function' }
14:44:45.514  ✓ Generating static pages (1058/1058)
14:44:45.590    Finalizing page optimization ...
14:44:45.591    Collecting build traces ...
14:44:45.598 
14:44:45.637 Route (app)                                                                   Size     First Load JS
14:44:45.637 ┌ ○ /                                                                         23.4 kB         210 kB
14:44:45.637 ├ ○ /_not-found                                                               883 B          88.6 kB
14:44:45.637 ├ ○ /about                                                                    191 B           102 kB
14:44:45.638 ├ ○ /account                                                                  5.47 kB         150 kB
14:44:45.638 ├ ○ /account/orders                                                           3.33 kB         148 kB
14:44:45.638 ├ ○ /account/school                                                           5.17 kB         150 kB
14:44:45.638 ├ ○ /account/settings                                                         3.83 kB         149 kB
14:44:45.638 ├ ○ /account/upgrade                                                          9.17 kB         154 kB
14:44:45.638 ├ ○ /admin                                                                    3.85 kB         149 kB
14:44:45.638 ├ ○ /admin/assessment-preview                                                 2.42 kB         135 kB
14:44:45.638 ├ ○ /admin/audio-generation                                                   3.45 kB         128 kB
14:44:45.638 ├ ○ /admin/blog                                                               5.83 kB         151 kB
14:44:45.638 ├ ○ /admin/blog/new                                                           4.07 kB         270 kB
14:44:45.638 ├ ○ /admin/freebies                                                           8.64 kB         154 kB
14:44:45.638 ├ ○ /admin/grammar/edit                                                       3.06 kB         136 kB
14:44:45.638 ├ ○ /admin/new                                                                7.66 kB         144 kB
14:44:45.638 ├ ○ /admin/products                                                           4.2 kB          140 kB
14:44:45.638 ├ ○ /admin/videos                                                             21.7 kB         230 kB
14:44:45.638 ├ ○ /admin/vocabulary                                                         25.3 kB         201 kB
14:44:45.638 ├ ○ /admin/worksheet-preview                                                  1.27 kB          89 kB
14:44:45.638 ├ ○ /admin/worksheets                                                         4.09 kB        91.8 kB
14:44:45.639 ├ ƒ /api/admin/aqa-listening/create                                           0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-listening/delete                                           0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-listening/get/[id]                                         0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-listening/list                                             0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-listening/update                                           0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-reading/create                                             0 B                0 B
14:44:45.639 ├ ƒ /api/admin/aqa-reading/delete                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-reading/get-next-identifier                                0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-reading/get/[paperId]                                      0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-reading/list                                               0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-reading/update                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/create                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/delete                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/get-next-identifier                                0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/get/[paperId]                                      0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/list                                               0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/update                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/aqa-writing/upload-photo                                       0 B                0 B
14:44:45.640 ├ ƒ /api/admin/backfill-leaderboards                                          0 B                0 B
14:44:45.640 ├ ƒ /api/admin/delete-account                                                 0 B                0 B
14:44:45.640 ├ ƒ /api/admin/generate-audio                                                 0 B                0 B
14:44:45.640 ├ ƒ /api/admin/generate-gemini-audio                                          0 B                0 B
14:44:45.640 ├ ƒ /api/admin/generate/worksheet                                             0 B                0 B
14:44:45.640 ├ ƒ /api/admin/generate/worksheet/print                                       0 B                0 B
14:44:45.640 ├ ƒ /api/admin/grammar/pages/create                                           0 B                0 B
14:44:45.640 ├ ƒ /api/admin/grammar/pages/update                                           0 B                0 B
14:44:45.640 ├ ƒ /api/admin/grammar/revalidate                                             0 B                0 B
14:44:45.641 ├ ƒ /api/admin/grammar/test/update                                            0 B                0 B
14:44:45.641 ├ ƒ /api/admin/grammar/topics/create                                          0 B                0 B
14:44:45.641 ├ ƒ /api/admin/grammar/topics/delete                                          0 B                0 B
14:44:45.641 ├ ƒ /api/admin/grammar/update                                                 0 B                0 B
14:44:45.641 ├ ƒ /api/admin/migrate-users                                                  0 B                0 B
14:44:45.641 ├ ƒ /api/admin/reading-comprehension/create                                   0 B                0 B
14:44:45.641 ├ ƒ /api/admin/reading-comprehension/delete                                   0 B                0 B
14:44:45.641 ├ ƒ /api/admin/reading-comprehension/update                                   0 B                0 B
14:44:45.641 ├ ○ /api/admin/vocabulary-template                                            0 B                0 B
14:44:45.641 ├ ƒ /api/ai-insights                                                          0 B                0 B
14:44:45.641 ├ ƒ /api/ai-insights/pipeline                                                 0 B                0 B
14:44:45.641 ├ ƒ /api/ai/generate-crossword-words                                          0 B                0 B
14:44:45.641 ├ ƒ /api/ai/generate-word-search-words                                        0 B                0 B
14:44:45.641 ├ ƒ /api/analytics/gem-collector                                              0 B                0 B
14:44:45.641 ├ ƒ /api/analytics/gem-collector/export                                       0 B                0 B
14:44:45.641 ├ ƒ /api/assessments/mark                                                     0 B                0 B
14:44:45.641 ├ ƒ /api/assessments/reading/generate                                         0 B                0 B
14:44:45.641 ├ ƒ /api/assessments/reading/override                                         0 B                0 B
14:44:45.641 ├ ƒ /api/assessments/reading/results                                          0 B                0 B
14:44:45.641 ├ ƒ /api/assignments/[assignmentId]                                           0 B                0 B
14:44:45.641 ├ ƒ /api/assignments/[assignmentId]/progress                                  0 B                0 B
14:44:45.641 ├ ƒ /api/assignments/[assignmentId]/vocabulary                                0 B                0 B
14:44:45.641 ├ ƒ /api/assignments/create                                                   0 B                0 B
14:44:45.641 ├ ƒ /api/assignments/progress                                                 0 B                0 B
14:44:45.642 ├ ƒ /api/auth                                                                 0 B                0 B
14:44:45.642 ├ ƒ /api/auth/accept-invitation                                               0 B                0 B
14:44:45.642 ├ ƒ /api/auth/callback                                                        0 B                0 B
14:44:45.642 ├ ƒ /api/auth/check-user                                                      0 B                0 B
14:44:45.642 ├ ƒ /api/auth/config-check                                                    0 B                0 B
14:44:45.642 ├ ƒ /api/auth/cross-domain                                                    0 B                0 B
14:44:45.642 ├ ƒ /api/auth/request-password-reset                                          0 B                0 B
14:44:45.642 ├ ƒ /api/auth/resend-verification                                             0 B                0 B
14:44:45.642 ├ ƒ /api/auth/signup                                                          0 B                0 B
14:44:45.642 ├ ƒ /api/auth/signup-learner                                                  0 B                0 B
14:44:45.642 ├ ƒ /api/auth/student-login                                                   0 B                0 B
14:44:45.642 ├ ƒ /api/beta/email-capture                                                   0 B                0 B
14:44:45.642 ├ ƒ /api/beta/feedback                                                        0 B                0 B
14:44:45.642 ├ ƒ /api/blog/generate-content                                                0 B                0 B
14:44:45.642 ├ ƒ /api/blog/publish-now                                                     0 B                0 B
14:44:45.642 ├ ƒ /api/blog/publish-scheduled                                               0 B                0 B
14:44:45.642 ├ ƒ /api/blog/schedule                                                        0 B                0 B
14:44:45.642 ├ ƒ /api/blog/send-notifications                                              0 B                0 B
14:44:45.642 ├ ƒ /api/blog/subscribe                                                       0 B                0 B
14:44:45.642 ├ ƒ /api/blog/update                                                          0 B                0 B
14:44:45.642 ├ ƒ /api/brevo/webhook                                                        0 B                0 B
14:44:45.642 ├ ƒ /api/chatbot                                                              0 B                0 B
14:44:45.642 ├ ƒ /api/classes/school-filtered                                              0 B                0 B
14:44:45.643 ├ ƒ /api/contact                                                              0 B                0 B
14:44:45.643 ├ ƒ /api/cron/expire-trials                                                   0 B                0 B
14:44:45.643 ├ ƒ /api/curriculum/vocabulary                                                0 B                0 B
14:44:45.643 ├ ƒ /api/dashboard/assignment-analytics/[assignmentId]                        0 B                0 B
14:44:45.643 ├ ƒ /api/dashboard/leaderboards                                               0 B                0 B
14:44:45.643 ├ ƒ /api/dashboard/vocabulary/analytics                                       0 B                0 B
14:44:45.643 ├ ƒ /api/dashboard/vocabulary/proficiency                                     0 B                0 B
14:44:45.643 ├ ○ /api/debug-vocab                                                          0 B                0 B
14:44:45.643 ├ ƒ /api/debug/vocabulary-mining-data                                         0 B                0 B
14:44:45.643 ├ ƒ /api/dictation/assessments                                                0 B                0 B
14:44:45.643 ├ ƒ /api/dictation/assessments/[id]                                           0 B                0 B
14:44:45.643 ├ ƒ /api/dictation/assessments/[id]/questions                                 0 B                0 B
14:44:45.643 ├ ƒ /api/dictation/questions                                                  0 B                0 B
14:44:45.643 ├ ƒ /api/download/free-resource/[orderId]                                     0 B                0 B
14:44:45.643 ├ ƒ /api/four-skills-assessment/results                                       0 B                0 B
14:44:45.643 ├ ƒ /api/free-resources/capture                                               0 B                0 B
14:44:45.643 ├ ƒ /api/games/detective-listening                                            0 B                0 B
14:44:45.643 ├ ƒ /api/games/gem-collector/sentences                                        0 B                0 B
14:44:45.643 ├ ƒ /api/games/gem-collector/sessions                                         0 B                0 B
14:44:45.643 ├ ƒ /api/games/speed-builder/sentences                                        0 B                0 B
14:44:45.643 ├ ƒ /api/games/speed-builder/sessions                                         0 B                0 B
14:44:45.643 ├ ƒ /api/games/speed-builder/unified-sentences                                0 B                0 B
14:44:45.643 ├ ƒ /api/games/word-blast/sentences                                           0 B                0 B
14:44:45.643 ├ ƒ /api/grammar/batch-generate-all-content                                   0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/batch-generate-tests                                         0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/content                                                      0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/discover-topics                                              0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/generate-test-content                                        0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/practice-status                                              0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/progress                                                     0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/quiz-questions                                               0 B                0 B
14:44:45.644 ├ ƒ /api/grammar/topics                                                       0 B                0 B
14:44:45.644 ├ ƒ /api/orders/[orderId]                                                     0 B                0 B
14:44:45.644 ├ ƒ /api/orders/[orderId]/download/[productId]                                0 B                0 B
14:44:45.644 ├ ƒ /api/orders/by-session/[sessionId]                                        0 B                0 B
14:44:45.644 ├ ƒ /api/orders/create-free-order                                             0 B                0 B
14:44:45.644 ├ ƒ /api/orders/resend-email                                                  0 B                0 B
14:44:45.644 ├ ○ /api/products                                                             0 B                0 B
14:44:45.644 ├ ƒ /api/products/download                                                    0 B                0 B
14:44:45.644 ├ ○ /api/products/free                                                        0 B                0 B
14:44:45.644 ├ ○ /api/reading-comprehension/categories                                     0 B                0 B
14:44:45.644 ├ ƒ /api/reading-comprehension/results                                        0 B                0 B
14:44:45.644 ├ ƒ /api/reading-comprehension/tasks                                          0 B                0 B
14:44:45.644 ├ ƒ /api/resources/curriculum                                                 0 B                0 B
14:44:45.644 ├ ƒ /api/resources/download                                                   0 B                0 B
14:44:45.644 ├ ƒ /api/resources/resources                                                  0 B                0 B
14:44:45.644 ├ ƒ /api/revalidate                                                           0 B                0 B
14:44:45.644 ├ ƒ /api/save-session                                                         0 B                0 B
14:44:45.645 ├ ƒ /api/school-codes/suggestions                                             0 B                0 B
14:44:45.645 ├ ƒ /api/school/invite-teacher                                                0 B                0 B
14:44:45.645 ├ ƒ /api/school/members                                                       0 B                0 B
14:44:45.645 ├ ○ /api/sentences/categories                                                 0 B                0 B
14:44:45.645 ├ ○ /api/sentences/subcategories                                              0 B                0 B
14:44:45.645 ├ ƒ /api/sentry-example-api                                                   0 B                0 B
14:44:45.645 ├ ƒ /api/stripe/create-checkout-session                                       0 B                0 B
14:44:45.645 ├ ƒ /api/stripe/create-product                                                0 B                0 B
14:44:45.645 ├ ƒ /api/stripe/debug                                                         0 B                0 B
14:44:45.645 ├ ƒ /api/stripe/webhook                                                       0 B                0 B
14:44:45.645 ├ ƒ /api/student/vocabulary-analytics                                         0 B                0 B
14:44:45.645 ├ ƒ /api/student/weak-words-analysis                                          0 B                0 B
14:44:45.645 ├ ƒ /api/student/weak-words-analysis-simple                                   0 B                0 B
14:44:45.645 ├ ƒ /api/students/bulk                                                        0 B                0 B
14:44:45.645 ├ ƒ /api/students/credentials                                                 0 B                0 B
14:44:45.645 ├ ƒ /api/students/delete                                                      0 B                0 B
14:44:45.645 ├ ƒ /api/students/fix-credentials                                             0 B                0 B
14:44:45.645 ├ ƒ /api/students/password                                                    0 B                0 B
14:44:45.645 ├ ƒ /api/students/reset-password                                              0 B                0 B
14:44:45.645 ├ ƒ /api/students/update-passwords                                            0 B                0 B
14:44:45.646 ├ ƒ /api/teacher-analytics/assignment-analysis                                0 B                0 B
14:44:45.646 ├ ƒ /api/teacher-analytics/assignment-simple                                  0 B                0 B
14:44:45.646 ├ ƒ /api/teacher-analytics/class-summary                                      0 B                0 B
14:44:45.646 ├ ƒ /api/teacher-analytics/student-profile                                    0 B                0 B
14:44:45.646 ├ ƒ /api/test-email                                                           0 B                0 B
14:44:45.646 ├ ○ /api/test-listening-service                                               0 B                0 B
14:44:45.646 ├ ƒ /api/test-vocabulary                                                      0 B                0 B
14:44:45.646 ├ ƒ /api/test/create-test-purchase                                            0 B                0 B
14:44:45.646 ├ ƒ /api/topic-assessments                                                    0 B                0 B
14:44:45.647 ├ ƒ /api/topic-assessments/[id]                                               0 B                0 B
14:44:45.647 ├ ƒ /api/topic-assessments/[id]/questions                                     0 B                0 B
14:44:45.647 ├ ƒ /api/trial/start                                                          0 B                0 B
14:44:45.647 ├ ƒ /api/upload/image                                                         0 B                0 B
14:44:45.647 ├ ƒ /api/user/profile                                                         0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary                                                           0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary-tests/[testId]/start                                      0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary-tests/[testId]/submit                                     0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary-tests/create                                              0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/categories                                                0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/categorize                                                0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/languages                                                 0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/preview                                                   0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/stats                                                     0 B                0 B
14:44:45.647 ├ ƒ /api/vocabulary/words                                                     0 B                0 B
14:44:45.648 ├ ƒ /api/word-search/generate                                                 0 B                0 B
14:44:45.648 ├ ƒ /api/word-search/save                                                     0 B                0 B
14:44:45.648 ├ ƒ /api/workbooks/generate-aqa-spanish                                       0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/[id]/download                                             0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/cache/clear                                               0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/generate                                                  0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/generate-html                                             0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/generate-pdf                                              0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/generate-sentence-builder                                 0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/progress/[jobId]                                          0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/public                                                    0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/sentence-builder/[id]                                     0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/sentence-builder/[id]/pdf                                 0 B                0 B
14:44:45.648 ├ ƒ /api/worksheets/track-download                                            0 B                0 B
14:44:45.648 ├ ○ /aqa-french-gcse                                                          347 B          96.8 kB
14:44:45.648 ├ ○ /aqa-german-gcse                                                          348 B          96.8 kB
14:44:45.648 ├ ○ /aqa-listening-test                                                       622 B          88.3 kB
14:44:45.648 ├ ƒ /aqa-listening-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]  6.68 kB         144 kB
14:44:45.648 ├ ƒ /aqa-listening-test/[language]/[tier]/[paper]                             2.6 kB          154 kB
14:44:45.648 ├ ○ /aqa-listening-test/demo2                                                 1.75 kB         153 kB
14:44:45.648 ├ ƒ /aqa-reading-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]    2.33 kB         146 kB
14:44:45.649 ├ ƒ /aqa-reading-test/[language]/[tier]/[paper]                               3.34 kB         152 kB
14:44:45.649 ├ ○ /aqa-reading-test/foundation                                              1.48 kB        89.2 kB
14:44:45.649 ├ ƒ /aqa-reading-test/french/[tier]                                           235 B            88 kB
14:44:45.649 ├ ƒ /aqa-reading-test/french/[tier]/[paper]                                   235 B            88 kB
14:44:45.649 ├ ƒ /aqa-reading-test/german/[tier]/[paper]                                   235 B            88 kB
14:44:45.649 ├ ○ /aqa-reading-test/higher                                                  613 B          88.3 kB
14:44:45.649 ├ ƒ /aqa-reading-test/spanish/[tier]                                          235 B            88 kB
14:44:45.649 ├ ƒ /aqa-reading-test/spanish/[tier]/[paper]                                  235 B            88 kB
14:44:45.649 ├ ○ /aqa-spanish-gcse                                                         348 B          96.8 kB
14:44:45.649 ├ ○ /aqa-writing-test                                                         620 B          88.3 kB
14:44:45.649 ├ ƒ /aqa-writing-test-topic/[language]/[tier]/[theme]/[topic]/[identifier]    5.79 kB         143 kB
14:44:45.649 ├ ƒ /aqa-writing-test/[language]/[tier]/[paper]                               3 kB            152 kB
14:44:45.649 ├ ○ /assessments                                                              2.35 kB         119 kB
14:44:45.649 ├ ○ /assessments/aqa-listening                                                1.18 kB         144 kB
14:44:45.649 ├ ○ /assessments/aqa-reading                                                  1.95 kB         142 kB
14:44:45.649 ├ ƒ /assessments/assignment/[assignmentId]                                    3.8 kB          140 kB
14:44:45.649 ├ ○ /assessments/dictation                                                    3.4 kB          161 kB
14:44:45.649 ├ ○ /assessments/four-skills                                                  671 B          88.4 kB
14:44:45.649 ├ ○ /assessments/gcse-listening                                               12 kB           189 kB
14:44:45.649 ├ ○ /assessments/gcse-reading                                                 15.2 kB         197 kB
14:44:45.650 ├ ○ /assessments/gcse-speaking                                                2.76 kB        99.2 kB
14:44:45.650 ├ ○ /assessments/gcse-writing                                                 21 kB           187 kB
14:44:45.650 ├ ○ /assessments/reading-comprehension                                        4.24 kB         160 kB
14:44:45.650 ├ ○ /assessments/topic-based                                                  2.88 kB         164 kB
14:44:45.650 ├ ○ /auth/confirmed                                                           1.73 kB        98.2 kB
14:44:45.650 ├ ○ /auth/forgot-password                                                     2.27 kB        98.7 kB
14:44:45.650 ├ ○ /auth/login                                                               2.53 kB         135 kB
14:44:45.650 ├ ○ /auth/login-learner                                                       4 kB            185 kB
14:44:45.650 ├ ○ /auth/login-teacher                                                       4.21 kB         186 kB
14:44:45.650 ├ ○ /auth/reset-password                                                      3.2 kB          148 kB
14:44:45.650 ├ ○ /auth/signup                                                              5.55 kB         187 kB
14:44:45.650 ├ ○ /auth/signup-learner                                                      3.89 kB         185 kB
14:44:45.650 ├ ○ /auth/student-login                                                       7.46 kB         185 kB
14:44:45.650 ├ ○ /auth/verify-email                                                        2.48 kB        98.9 kB
14:44:45.650 ├ ƒ /blog                                                                     6.29 kB         151 kB
14:44:45.650 ├ ƒ /blog/[slug]                                                              7.21 kB         225 kB
14:44:45.650 ├ ○ /blog/aqa-gcse-speaking-photocard-guide                                   347 B          96.8 kB
14:44:45.650 ├ ○ /blog/best-vocabulary-learning-techniques-gcse                            147 B           100 kB
14:44:45.650 ├ ○ /blog/complete-guide-gcse-spanish-vocabulary-themes                       347 B          96.8 kB
14:44:45.650 ├ ○ /blog/complete-guide-spaced-repetition-vocabulary-learning                347 B          96.8 kB
14:44:45.650 ├ ○ /blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam         347 B          96.8 kB
14:44:45.650 ├ ○ /blog/gamification-language-learning-classroom                            347 B          96.8 kB
14:44:45.650 ├ ○ /blog/gcse-german-writing-exam-tips                                       3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/gcse-spanish-speaking-exam-tips                                     3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/german-cases-explained-simple-guide                                 3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/german-movies-tv-shows-listening-skills                             3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/imparfait-vs-passe-compose-simple-guide                             3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/jouer-a-vs-jouer-de-explained                                       347 B          96.8 kB
14:44:45.651 ├ ○ /blog/ks3-french-word-blast-game-better-than-flashcards                   3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/language-learning-apps-vs-educational-software                      347 B          96.8 kB
14:44:45.651 ├ ○ /blog/por-vs-para-guide                                                   347 B          96.8 kB
14:44:45.651 ├ ○ /blog/pronunciation-in-the-reading-aloud-task                             347 B          96.8 kB
14:44:45.651 ├ ○ /blog/science-of-gamification-language-learning                           147 B           100 kB
14:44:45.651 ├ ○ /blog/ser-vs-estar-ultimate-guide-students                                3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/spaced-repetition-vs-cramming                                       3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/spanish-90-word-response-tonics-formula                             3.04 kB        99.5 kB
14:44:45.651 ├ ○ /blog/top-tips-gcse-writing-six-pillars                                   347 B          96.8 kB
14:44:45.651 ├ ○ /cart                                                                     7.16 kB         160 kB
14:44:45.651 ├ ○ /challenges/daily                                                         584 B          88.3 kB
14:44:45.651 ├ ○ /checkout/success                                                         3.49 kB        99.9 kB
14:44:45.651 ├ ○ /community                                                                348 B          96.8 kB
14:44:45.651 ├ ○ /contact                                                                  5.97 kB         102 kB
14:44:45.651 ├ ○ /contact-sales                                                            7.65 kB         104 kB
14:44:45.651 ├ ○ /cookies                                                                  347 B          96.8 kB
14:44:45.651 ├ ○ /dashboard                                                                10.5 kB         156 kB
14:44:45.652 ├ ○ /dashboard/achievements                                                   3.5 kB          149 kB
14:44:45.652 ├ ○ /dashboard/admin/migrate                                                  3.86 kB        99.4 kB
14:44:45.652 ├ ○ /dashboard/analytics/cross-game                                           5.06 kB         150 kB
14:44:45.652 ├ ○ /dashboard/analytics/gem-collector                                        4.22 kB         235 kB
14:44:45.652 ├ ○ /dashboard/assessments                                                    2.54 kB         161 kB
14:44:45.652 ├ ƒ /dashboard/assessments/[id]/analytics                                     3 kB            156 kB
14:44:45.652 ├ ○ /dashboard/assessments/new                                                4.04 kB         195 kB
14:44:45.652 ├ ○ /dashboard/assignments                                                    3.83 kB         163 kB
14:44:45.652 ├ ƒ /dashboard/assignments/[assignmentId]/edit                                3.96 kB         149 kB
14:44:45.652 ├ ƒ /dashboard/assignments/[assignmentId]/preview                             1.2 kB         88.9 kB
14:44:45.652 ├ ○ /dashboard/assignments/new                                                36.1 kB         236 kB
14:44:45.652 ├ ○ /dashboard/assignments/new/exam                                           3 kB           99.4 kB
14:44:45.652 ├ ○ /dashboard/classes                                                        5.12 kB         150 kB
14:44:45.652 ├ ƒ /dashboard/classes/[classId]                                              142 kB          462 kB
14:44:45.652 ├ ƒ /dashboard/classes/[classId]/edit                                         5.87 kB         159 kB
14:44:45.652 ├ ƒ /dashboard/classes/[classId]/vocabulary-analytics                         4.63 kB         146 kB
14:44:45.652 ├ ○ /dashboard/content                                                        565 B          88.3 kB
14:44:45.652 ├ ○ /dashboard/content/create                                                 572 B          88.3 kB
14:44:45.652 ├ ○ /dashboard/content/import                                                 3.7 kB          140 kB
14:44:45.652 ├ ○ /dashboard/content/speed-builder                                          6.92 kB         185 kB
14:44:45.652 ├ ○ /dashboard/content/speed-builder/bulk-upload                              4.59 kB         182 kB
14:44:45.652 ├ ○ /dashboard/games                                                          5.17 kB         150 kB
14:44:45.653 ├ ○ /dashboard/grammar/analytics                                              2.4 kB          187 kB
14:44:45.653 ├ ○ /dashboard/home                                                           3.36 kB         148 kB
14:44:45.653 ├ ○ /dashboard/leaderboards                                                   6.67 kB         158 kB
14:44:45.653 ├ ○ /dashboard/overview                                                       2.03 kB         144 kB
14:44:45.653 ├ ○ /dashboard/preview                                                        5.12 kB         150 kB
14:44:45.653 ├ ○ /dashboard/progress                                                       1.6 kB          143 kB
14:44:45.653 ├ ƒ /dashboard/progress/assignment/[assignmentId]                             5.19 kB         158 kB
14:44:45.653 ├ ƒ /dashboard/progress/student/[studentId]                                   3.26 kB          91 kB
14:44:45.653 ├ ○ /dashboard/reports                                                        4.56 kB         150 kB
14:44:45.653 ├ ○ /dashboard/settings                                                       2.87 kB         139 kB
14:44:45.653 ├ ○ /dashboard/students                                                       4.61 kB         150 kB
14:44:45.653 ├ ○ /dashboard/vocabulary                                                     8.83 kB         159 kB
14:44:45.653 ├ ○ /dashboard/vocabulary-mining                                              5.06 kB         155 kB
14:44:45.653 ├ ○ /dashboard/vocabulary-mining/controls                                     5.53 kB         151 kB
14:44:45.653 ├ ○ /dashboard/vocabulary-mining/curriculum                                   6.16 kB         151 kB
14:44:45.653 ├ ƒ /dashboard/vocabulary-mining/curriculum/[id]/coverage                     3.42 kB         153 kB
14:44:45.653 ├ ○ /dashboard/vocabulary-mining/reports                                      1.37 kB         138 kB
14:44:45.653 ├ ○ /dashboard/vocabulary-tests                                               15.7 kB         192 kB
14:44:45.653 ├ ƒ /dashboard/vocabulary/[listId]                                            4.49 kB         149 kB
14:44:45.653 ├ ○ /dashboard/vocabulary/analytics                                           1.89 kB         292 kB
14:44:45.653 ├ ○ /dashboard/vocabulary/create                                              5.4 kB          150 kB
14:44:45.653 ├ ○ /dashboard/vocabulary/proficiency-test                                    1.78 kB         135 kB
14:44:45.653 ├ ○ /debug/sentence-config                                                    1.51 kB        89.2 kB
14:44:45.654 ├ ○ /diagnostics                                                              3.18 kB        90.9 kB
14:44:45.654 ├ ○ /dictation                                                                7.61 kB         153 kB
14:44:45.654 ├ ƒ /dictation/[language]/[tier]/[paper]                                      1.83 kB         154 kB
14:44:45.654 ├ ○ /documentation                                                            6.51 kB         103 kB
14:44:45.654 ├ ƒ /download/[sessionId]                                                     3.32 kB         141 kB
14:44:45.654 ├ ƒ /download/resource/[resourceId]                                           0 B                0 B
14:44:45.654 ├ ○ /edexcel-french-gcse                                                      347 B          96.8 kB
14:44:45.654 ├ ○ /edexcel-german-gcse                                                      347 B          96.8 kB
14:44:45.654 ├ ○ /edexcel-listening-test                                                   626 B          88.3 kB
14:44:45.654 ├ ƒ /edexcel-listening-test/[language]/[tier]/[paper]                         4 kB            157 kB
14:44:45.654 ├ ○ /edexcel-spanish-gcse                                                     347 B          96.8 kB
14:44:45.654 ├ ○ /exam-style-assessment-topic                                              12 kB           157 kB
14:44:45.654 ├ ○ /exam-style-assessment/task                                               928 B          88.6 kB
14:44:45.654 ├ ○ /exams                                                                    1.93 kB         104 kB
14:44:45.654 ├ ƒ /exams/[examBoard]                                                        1.28 kB          89 kB
14:44:45.654 ├ ƒ /exams/[examBoard]/[level]                                                1.75 kB        89.5 kB
14:44:45.654 ├ ƒ /exams/[examBoard]/[level]/[theme]                                        1.68 kB        89.4 kB
14:44:45.654 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]                                1.78 kB        89.5 kB
14:44:45.654 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]/reading                        3.75 kB        91.5 kB
14:44:45.655 ├ ƒ /exams/[examBoard]/[level]/[theme]/[topic]/vocabulary                     3.31 kB          91 kB
14:44:45.655 ├ ○ /exams/aqa/ks4_gcse/listening                                             5.42 kB         102 kB
14:44:45.655 ├ ○ /exams/aqa/ks4_gcse/speaking                                              6.29 kB         103 kB
14:44:45.655 ├ ○ /exams/aqa/ks4_gcse/writing                                               5.89 kB         107 kB
14:44:45.655 ├ ○ /exams/specification                                                      3.77 kB         100 kB
14:44:45.655 ├ ○ /explore                                                                  347 B          96.8 kB
14:44:45.656 ├ ○ /four-skills-assessment                                                   4.16 kB        91.9 kB
14:44:45.656 ├ ○ /four-skills-assessment/test                                              8.48 kB         155 kB
14:44:45.656 ├ ○ /free-resources                                                           6.76 kB         160 kB
14:44:45.656 ├ ○ /games                                                                    13.6 kB         220 kB
14:44:45.656 ├ ○ /games/case-file-translator                                               12.2 kB         232 kB
14:44:45.656 ├ ƒ /games/case-file-translator/assignment/[assignmentId]                     687 B           137 kB
14:44:45.656 ├ ○ /games/conjugation-duel                                                   36.2 kB         238 kB
14:44:45.656 ├ ƒ /games/conjugation-duel/assignment/[assignmentId]                         681 B           137 kB
14:44:45.656 ├ ○ /games/detective-listening                                                5.75 kB         243 kB
14:44:45.656 ├ ƒ /games/detective-listening/assignment/[assignmentId]                      4.57 kB         231 kB
14:44:45.656 ├ ○ /games/hangman                                                            28.4 kB         258 kB
14:44:45.656 ├ ƒ /games/hangman/assignment/[assignmentId]                                  667 B           137 kB
14:44:45.656 ├ ○ /games/lava-temple-word-restore                                           11.1 kB         233 kB
14:44:45.656 ├ ƒ /games/lava-temple-word-restore/assignment/[assignmentId]                 689 B           137 kB
14:44:45.656 ├ ○ /games/memory-game                                                        24.4 kB         250 kB
14:44:45.656 ├ ƒ /games/memory-game/assignment/[assignmentId]                              677 B           137 kB
14:44:45.656 ├ ○ /games/multi-game                                                         4.89 kB         186 kB
14:44:45.656 ├ ○ /games/noughts-and-crosses                                                10.1 kB         248 kB
14:44:45.656 ├ ƒ /games/noughts-and-crosses/assignment/[assignmentId]                      7.62 kB         227 kB
14:44:45.657 ├ ○ /games/sentence-towers                                                    15.1 kB         232 kB
14:44:45.657 ├ ƒ /games/sentence-towers/assignment/[assignmentId]                          678 B           137 kB
14:44:45.657 ├ ○ /games/speed-builder                                                      26.9 kB         249 kB
14:44:45.657 ├ ƒ /games/speed-builder/assignment/[assignmentId]                            677 B           137 kB
14:44:45.657 ├ ○ /games/verb-quest                                                         25.8 kB         234 kB
14:44:45.657 ├ ○ /games/vocab-blast                                                        7.29 kB         244 kB
14:44:45.657 ├ ƒ /games/vocab-blast/assignment/[assignmentId]                              5.16 kB         223 kB
14:44:45.657 ├ ƒ /games/vocab-master                                                       235 B            88 kB
14:44:45.657 ├ ƒ /games/vocab-master/assignment/[assignmentId]                             32.9 kB         231 kB
14:44:45.657 ├ ○ /games/vocabulary-mining                                                  26.5 kB         247 kB
14:44:45.657 ├ ○ /games/vocabulary-test                                                    4.26 kB         144 kB
14:44:45.657 ├ ○ /games/word-blast                                                         21.1 kB         259 kB
14:44:45.657 ├ ƒ /games/word-blast/assignment/[assignmentId]                               676 B           137 kB
14:44:45.657 ├ ○ /games/word-scramble                                                      6.17 kB         230 kB
14:44:45.657 ├ ƒ /games/word-scramble/assignment/[assignmentId]                            5.82 kB         207 kB
14:44:45.657 ├ ○ /games/word-towers                                                        238 B           245 kB
14:44:45.657 ├ ƒ /games/word-towers/assignment/[assignmentId]                              876 B           246 kB
14:44:45.657 ├ ○ /gcse-french-learning                                                     347 B          96.8 kB
14:44:45.657 ├ ○ /gcse-german-learning                                                     347 B          96.8 kB
14:44:45.658 ├ ○ /gcse-language-learning                                                   347 B          96.8 kB
14:44:45.658 ├ ○ /gcse-spanish-learning                                                    347 B          96.8 kB
14:44:45.658 ├ ○ /grammar                                                                  6.67 kB         160 kB
14:44:45.658 ├ ○ /grammar-OLD-BACKUP                                                       5.13 kB         138 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]                                            5.08 kB         186 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]                                 5.62 kB         187 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]/[topic]                         5.48 kB         187 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]/[topic]/lesson                  1.73 kB         184 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]/[topic]/lesson/[slug]           1.51 kB         183 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]/[topic]/practice                4.29 kB         198 kB
14:44:45.658 ├ ƒ /grammar-OLD-BACKUP/[language]/[category]/[topic]/quiz                    2.26 kB         191 kB
14:44:45.658 ├ ○ /grammar-OLD-BACKUP/french                                                5 kB            138 kB
14:44:45.658 ├ ○ /grammar-OLD-BACKUP/french/adjectives/agreement-rules                     903 B           191 kB
14:44:45.658 ├ ○ /grammar-OLD-BACKUP/french/adjectives/comparative                         903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/demonstrative                       903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/indefinite-adjectives               903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/interrogative-adjectives            903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/irregular-adjectives                903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/placement                           903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/possessive-adjectives               903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adjectives/superlative                         903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/adverbial-phrases                      903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/comparative                            903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/degree                                 903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/formation                              903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/frequency                              903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/interrogative                          903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/negation-adverbs                       903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/placement                              903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/quantifiers                            903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/time                                   903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/adverbs/time-place                             903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/conjunctions/coordinating                      903 B           191 kB
14:44:45.659 ├ ○ /grammar-OLD-BACKUP/french/conjunctions/correlative                       903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/conjunctions/subordinating                     904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/collective-nouns                         903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/contractions                             903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/definite-articles                        903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/gender-number                            903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/gender-rules                             903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/indefinite-articles                      903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/noun-agreement                           903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/noun-agreement-patterns                  903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/partitive-articles                       903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/nouns/plural-formation                         903 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/numbers/advanced-time                          904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/numbers/cardinal                               904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/numbers/dates-time                             904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/numbers/fractions                              904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/numbers/ordinal                                905 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/prepositions/basic-prepositions                904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/prepositions/common-prepositions               904 B           191 kB
14:44:45.660 ├ ○ /grammar-OLD-BACKUP/french/prepositions/compound-prepositions             904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/prepositions/location                          904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/prepositions/prepositions-movement             903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/prepositions/prepositions-time                 903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/prepositions/time                              903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/demonstrative                         903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/direct-object                         903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/disjunctive                           903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/indefinite                            904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/indirect-object                       904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/interrogative                         903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/possessive                            904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/pronoun-order                         903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/reflexive                             902 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/relative-dont                         903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/relative-pronouns                     904 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/relative-que                          903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/relative-qui                          903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/subject-pronouns                      903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/y-en                                  903 B           191 kB
14:44:45.661 ├ ○ /grammar-OLD-BACKUP/french/pronouns/y-en-pronouns                         903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/syntax/complex-sentences                       903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/syntax/negation                                903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/syntax/questions                               903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/syntax/word-order                              903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs                                          4.69 kB         138 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/conditional                              903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/conditional-perfect                      903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/future                                   903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/future-perfect                           903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/immediate-future                         904 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/imparfait                                903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/imperative                               904 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/impersonal-verbs                         904 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/interrogative-forms                      904 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/irregular-verbs                          904 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/modes-of-address                         903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/negative-forms                           903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/passe-compose                            903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/perfect-infinitive                       903 B           191 kB
14:44:45.662 ├ ○ /grammar-OLD-BACKUP/french/verbs/pluperfect                               903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/present-participle                       903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/present-participle-en                    903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/present-perfect                          903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/present-tense                            904 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/reflexive-verbs                          903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/regular-conjugation                      903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/subjunctive                              903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/french/verbs/verbs-infinitive                         903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german                                                4.97 kB         138 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/adjectives/adjective-endings                   904 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/adjectives/comparative-superlative             903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases                                          5.44 kB         138 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/accusative                               903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/dative                                   903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/genitive                                 903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/nominative                               903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/prepositions                             903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/cases/two-way-prepositions                     903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/nouns/compound-nouns                           903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/nouns/declension                               903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/nouns/gender-rules                             903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/nouns/plural-formation                         903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/nouns/weak-nouns                               903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/prepositions/accusative-prepositions           903 B           191 kB
14:44:45.663 ├ ○ /grammar-OLD-BACKUP/german/prepositions/dative-prepositions               903 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/pronouns/object-pronouns                       904 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/pronouns/subject-pronouns                      903 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/syntax/word-order                              904 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/verbs                                          5.52 kB         138 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/verbs/future-tense                             903 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/verbs/modal-verbs                              903 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/verbs/passive-voice                            903 B           191 kB
14:44:45.664 ├ ○ /grammar-OLD-BACKUP/german/verbs/past-tense                               903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/german/verbs/perfect-tense                            902 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/german/verbs/present-tense                            903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/german/verbs/reflexive-verbs                          903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/german/verbs/separable-verbs                          904 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish                                               5.85 kB         139 kB
14:44:45.665 ├ ƒ /grammar-OLD-BACKUP/spanish/[category]/[topic]/challenge                  5.4 kB          187 kB
14:44:45.665 ├ ƒ /grammar-OLD-BACKUP/spanish/[category]/[topic]/test                       2.77 kB         196 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/adjective-agreement                903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/adjective-position                 903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/agreement                          903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/agreement/quiz                     3.35 kB         192 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/comparatives                       903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/comparison                         903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/comparison/quiz                    3.05 kB         191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/demonstrative                      903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/demonstrative/quiz                 408 B           132 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/indefinite                         903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/position                           903 B           191 kB
14:44:45.665 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/position/quiz                      403 B           132 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/possessive                         904 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adjectives/superlatives                       903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adverbial-prepositional/comparatives          903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adverbial-prepositional/personal-a            903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adverbial-prepositional/por-vs-para           903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adverbial-prepositional/superlatives          903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/adverbs/formation                             903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/articles/definite-articles                    903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/articles/definite-indefinite                  903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/articles/neuter-lo                            903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns                                         4.65 kB         137 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/agreement-position                      903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/articles                                5.04 kB         186 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/definite                                628 B           190 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/definite-indefinite                     902 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/demonstrative                           903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/gender                                  903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/gender-and-plurals                      903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/gender-plurals                          628 B           190 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/gender-rules                            903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/gender/quiz                             3.31 kB         192 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/indefinite                              903 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/nominalisation                          904 B           191 kB
14:44:45.666 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/plural-formation                        903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/plurals                                 903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/nouns/possessive-adj                          903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/prepositions/al-vs-del                        903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/prepositions/basic-prepositions               903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns                                      5.42 kB         138 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/demonstrative-pronouns               903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/direct-object                        903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/direct-object/quiz                   412 B           132 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/double-object-pronouns               903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/indefinite-pronouns                  903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/indirect-object                      903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/indirect-object/quiz                 415 B           132 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/interrogative                        902 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/personal                             903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/personal/quiz                        401 B           132 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/possessive                           903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/possessive/quiz                      403 B           132 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/reflexive                            903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/reflexive/quiz                       403 B           132 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/relative                             903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/subject                              903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/pronouns/subject-pronouns                     903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/sounds-spelling/sound-symbol                  903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/sounds-spelling/stress-patterns               903 B           191 kB
14:44:45.667 ├ ○ /grammar-OLD-BACKUP/spanish/sounds-spelling/written-accents               903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/syntax/questions                              903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/syntax/word-order                             903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs                                         4.78 kB         138 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/action-verbs                            903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/auxiliary-verbs                         903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/causative-verbs                         902 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/change-verbs                            902 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/cognitive-verbs                         903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/communication-verbs                     904 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/compound-tenses                         902 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/conditional                             903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/conditional-perfect                     903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/conditional-sentences                   903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/conditional-tense                       903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/conditional/quiz                        633 B           132 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/continuous-constructions                903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/copular-verbs                           903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/defective-verbs                         904 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/emotion-verbs                           903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/existential-verbs                       903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/future                                  903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/future-perfect                          903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/future-tense                            903 B           191 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/future/quiz                             629 B           132 kB
14:44:45.668 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/gerunds                                 903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperative                              903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperfect                               903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperfect-continuous                    903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperfect-tense                         903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperfect-vs-preterite                  903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/imperfect/quiz                          630 B           132 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/impersonal-verbs                        902 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/inchoative-verbs                        903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/infinitive-constructions                904 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/interrogatives                          903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/irregular-verbs                         903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/irregular-verbs/quiz                    829 B           132 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/light-verbs                             903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/modal-verbs                             903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/modal-verbs/quiz                        1.51 kB         133 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/motion-verbs                            903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/negation                                903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/passive-voice                           903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/past-participles                        903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/perception-verbs                        903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/periphrastic-future                     903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/phrasal-verbs                           903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/pluperfect                              903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/por-vs-para                             903 B           191 kB
14:44:45.669 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/possession-verbs                        903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-continuous                      903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-irregular                       903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-perfect                         902 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-regular                         903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-tense                           903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/present-tense/quiz                      2.7 kB          191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/preterite                               5.38 kB         187 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/preterite-tense                         903 B           191 kB
14:44:45.670 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/preterite/quiz                          629 B           132 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/progressive-tenses                      903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/pronominal-verbs                        903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/reflexive                               903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/reported-speech                         903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/sequence-of-tenses                      903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/ser-estar                               628 B           190 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/ser-vs-estar                            903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/ser-vs-estar/quiz                       894 B           132 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/stative-verbs                           903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/stem-changing                           903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive                             903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive-imperfect                   903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive-mood                        628 B           190 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive-perfect                     903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive-pluperfect                  903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive-present                     903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/subjunctive/quiz                        632 B           132 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/terminative-verbs                       903 B           191 kB
14:44:45.671 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/transitive-intransitive                 904 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-aspect                             903 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-complementation                    903 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-conjugation-patterns               903 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-government                         903 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-moods                              903 B           191 kB
14:44:45.672 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-patterns                           903 B           191 kB
14:44:45.676 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-serialization                      903 B           191 kB
14:44:45.676 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-tense-agreement                    903 B           191 kB
14:44:45.676 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verb-valency                            903 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/verbal-periphrases                      903 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/voice-constructions                     903 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/verbs/weather-verbs                           903 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/word-formation/adjective-adverb               904 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/word-formation/adjective-noun                 905 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/word-formation/augmentative-suffixes          903 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/word-formation/diminutive-suffixes            904 B           191 kB
14:44:45.677 ├ ○ /grammar-OLD-BACKUP/spanish/word-formation/suffixes-prefixes              903 B           191 kB
14:44:45.677 ├ ƒ /grammar/[language]                                                       5.06 kB         186 kB
14:44:45.677 ├ ƒ /grammar/[language]/[category]                                            235 B            88 kB
14:44:45.677 ├ ● /grammar/[language]/[category]/[topic]                                    5.6 kB          195 kB
14:44:45.677 ├   ├ /grammar/french/adjectives/agreement-rules
14:44:45.677 ├   ├ /grammar/french/adjectives/comparative
14:44:45.677 ├   ├ /grammar/french/adjectives/demonstrative
14:44:45.677 ├   └ [+288 more paths]
14:44:45.677 ├ ƒ /grammar/[language]/[category]/[topic]/challenge                          5.37 kB         187 kB
14:44:45.677 ├ ƒ /grammar/[language]/[category]/[topic]/practice                           7.5 kB          197 kB
14:44:45.677 ├ ƒ /grammar/[language]/[category]/[topic]/test                               2.76 kB         193 kB
14:44:45.677 ├ ○ /grammar/french                                                           5 kB            138 kB
14:44:45.678 ├ ○ /grammar/french/adjectives/agreement-rules/quiz                           1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/adjectives/comparison/quiz                                1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/adjectives/placement/quiz                                 1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/adverbs/formation/quiz                                    1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/nouns/articles/quiz                                       1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/nouns/gender/quiz                                         1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/pronouns/object/quiz                                      1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/pronouns/subject/quiz                                     1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/verbs/future-tense/quiz                                   1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/verbs/imparfait/quiz                                      1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/verbs/passe-compose/quiz                                  1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/french/verbs/present-tense/quiz                                  1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/german                                                           4.97 kB         138 kB
14:44:45.678 ├ ○ /grammar/german/adjectives/comparison/quiz                                1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/german/adjectives/endings/quiz                                   1.65 kB         191 kB
14:44:45.678 ├ ƒ /grammar/german/adverbs/formation                                         903 B           191 kB
14:44:45.678 ├ ○ /grammar/german/cases/accusative/quiz                                     1.65 kB         191 kB
14:44:45.678 ├ ○ /grammar/german/cases/dative/quiz                                         1.64 kB         191 kB
14:44:45.678 ├ ○ /grammar/german/cases/genitive/quiz                                       1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/german/cases/nominative/quiz                                     1.65 kB         191 kB
14:44:45.679 ├ ƒ /grammar/german/nouns/compound-nouns                                      903 B           191 kB
14:44:45.679 ├ ƒ /grammar/german/nouns/declension                                          903 B           191 kB
14:44:45.679 ├ ○ /grammar/german/nouns/gender/quiz                                         1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/german/nouns/plurals/quiz                                        1.64 kB         191 kB
14:44:45.679 ├ ƒ /grammar/german/nouns/weak-nouns                                          903 B           191 kB
14:44:45.679 ├ ○ /grammar/german/pronouns/personal/quiz                                    1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/german/verbs/future-tense/quiz                                   1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/german/verbs/past-tense/quiz                                     1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/german/verbs/present-tense/quiz                                  1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish                                                          8.86 kB         190 kB
14:44:45.679 ├ ○ /grammar/spanish/adjectives/agreement/quiz                                1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/adjectives/comparison/quiz                               1.64 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/adjectives/demonstrative/quiz                            1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/adjectives/possessive/quiz                               1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/adverbs/formation/quiz                                   1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/adverbs/placement/quiz                                   1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/articles/definite/quiz                                   1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/articles/indefinite/quiz                                 1.65 kB         191 kB
14:44:45.679 ├ ○ /grammar/spanish/nouns/gender/quiz                                        1.64 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/nouns/plurals/quiz                                       1.64 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/prepositions/common/quiz                                 1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/pronouns/object/quiz                                     1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/pronouns/reflexive/quiz                                  1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/pronouns/subject/quiz                                    1.64 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/conditional/quiz                                   1.64 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/future-tense/quiz                                  1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/imperfect-tense/quiz                               1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/present-tense/quiz                                 1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/preterite-tense/quiz                               1.65 kB         191 kB
14:44:45.680 ├ ○ /grammar/spanish/verbs/ser-vs-estar/quiz                                  1.65 kB         191 kB
14:44:45.680 ├ ○ /help                                                                     3.77 kB         137 kB
14:44:45.680 ├ ○ /help-center                                                              6.13 kB         103 kB
14:44:45.680 ├ ○ /help/getting-started                                                     5.04 kB         138 kB
14:44:45.680 ├ ○ /learn                                                                    6.92 kB         188 kB
14:44:45.680 ├ ○ /learner-dashboard                                                        4.54 kB         186 kB
14:44:45.680 ├ ○ /learner-dashboard/challenges                                             3.9 kB          185 kB
14:44:45.680 ├ ○ /learner-dashboard/progress                                               3.93 kB         177 kB
14:44:45.681 ├ ○ /learner-dashboard/upgrade                                                3.61 kB         185 kB
14:44:45.681 ├ ○ /learner-dashboard/vocabulary                                             3.96 kB         185 kB
14:44:45.681 ├ ○ /legal/accessibility                                                      348 B          96.8 kB
14:44:45.681 ├ ○ /legal/ai-policy                                                          347 B          96.8 kB
14:44:45.681 ├ ○ /legal/disclaimer                                                         348 B          96.8 kB
14:44:45.681 ├ ○ /legal/gdpr                                                               348 B          96.8 kB
14:44:45.681 ├ ○ /links                                                                    3.2 kB          136 kB
14:44:45.681 ├ ○ /pricing                                                                  4.57 kB         137 kB
14:44:45.681 ├ ○ /privacy                                                                  348 B          96.8 kB
14:44:45.681 ├ ƒ /product/[slug]                                                           9.23 kB         165 kB
14:44:45.681 ├ ○ /reading-comprehension                                                    10.4 kB         155 kB
14:44:45.681 ├ ƒ /reading-comprehension/[language]/[category]/[subcategory]                12.9 kB         109 kB
14:44:45.681 ├ ○ /reading-comprehension/task                                               1.28 kB         143 kB
14:44:45.681 ├ ○ /resources                                                                9.96 kB         166 kB
14:44:45.681 ├ ƒ /resources/[language]                                                     3.15 kB        99.6 kB
14:44:45.681 ├ ƒ /resources/[language]/[keyStage]                                          6.65 kB         103 kB
14:44:45.681 ├ ● /resources/[language]/[keyStage]/[topic]                                  2.71 kB         159 kB
14:44:45.681 ├   ├ /resources/spanish/ks3/basics-core-language
14:44:45.681 ├   ├ /resources/spanish/ks3/identity-personal-life
14:44:45.681 ├   ├ /resources/spanish/ks3/home-local-area
14:44:45.681 ├   └ [+75 more paths]
14:44:45.681 ├ ○ /resources/skills                                                         815 B          97.3 kB
14:44:45.681 ├ ○ /resources/skills/french                                                  815 B          97.3 kB
14:44:45.681 ├ ○ /resources/skills/french/exam-practice                                    817 B          97.3 kB
14:44:45.681 ├ ○ /resources/skills/french/grammar                                          816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/french/vocabulary                                       347 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/french/vocabulary/frequency-packs                       347 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/french/vocabulary/games                                 347 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/french/vocabulary/vocab-booklets                        347 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/french/vocabulary/word-lists                            348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/german                                                  816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/german/exam-practice                                    816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/german/grammar                                          816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/german/vocabulary                                       348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/german/vocabulary/frequency-packs                       349 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/german/vocabulary/games                                 348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/german/vocabulary/vocab-booklets                        347 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/german/vocabulary/word-lists                            348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/spanish                                                 816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/spanish/exam-practice                                   816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/spanish/grammar                                         816 B          97.3 kB
14:44:45.682 ├ ○ /resources/skills/spanish/vocabulary                                      348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/spanish/vocabulary/frequency-packs                      348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/spanish/vocabulary/games                                348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/spanish/vocabulary/vocab-booklets                       348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/spanish/vocabulary/word-lists                           348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/speaking                                                348 B          96.8 kB
14:44:45.682 ├ ○ /resources/skills/vocabulary/frequency-packs                              347 B          96.8 kB
14:44:45.683 ├ ○ /resources/skills/vocabulary/games                                        235 B            88 kB
14:44:45.683 ├ ○ /resources/skills/vocabulary/vocab-booklets                               348 B          96.8 kB
14:44:45.683 ├ ○ /resources/skills/vocabulary/word-lists                                   348 B          96.8 kB
14:44:45.683 ├ ○ /resources/teachers                                                       347 B          96.8 kB
14:44:45.683 ├ ○ /resources/topics                                                         817 B          97.3 kB
14:44:45.683 ├ ○ /schools                                                                  12.5 kB         201 kB
14:44:45.683 ├ ○ /schools/pricing                                                          348 B          96.8 kB
14:44:45.683 ├ ○ /sentry-example-page                                                      8.1 kB         99.5 kB
14:44:45.683 ├ ○ /sitemap                                                                  347 B          96.8 kB
14:44:45.683 ├ ○ /sitemap.xml                                                              0 B                0 B
14:44:45.683 ├ ○ /songs                                                                    4.41 kB         186 kB
14:44:45.683 ├ ƒ /songs/[language]                                                         9.95 kB         218 kB
14:44:45.683 ├ ƒ /songs/[language]/video/[id]                                              8.84 kB         201 kB
14:44:45.683 ├ ○ /student                                                                  5.6 kB          187 kB
14:44:45.683 ├ ○ /student-dashboard                                                        27.1 kB         209 kB
14:44:45.683 ├ ○ /student-dashboard/assessments                                            5.85 kB         187 kB
14:44:45.683 ├ ○ /student-dashboard/assessments-redirect                                   533 B          88.2 kB
14:44:45.683 ├ ƒ /student-dashboard/assessments/[id]                                       4.14 kB         166 kB
14:44:45.683 ├ ○ /student-dashboard/assignments                                            7.3 kB          160 kB
14:44:45.683 ├ ƒ /student-dashboard/assignments/[assignmentId]                             15.2 kB         160 kB
14:44:45.683 ├ ○ /student-dashboard/exam-prep                                              546 B          88.3 kB
14:44:45.683 ├ ○ /student-dashboard/games                                                  14 kB           209 kB
14:44:45.683 ├ ƒ /student-dashboard/games/[gameId]                                         1.93 kB         138 kB
14:44:45.683 ├ ○ /student-dashboard/games/vocab-master                                     1.35 kB         138 kB
14:44:45.683 ├ ○ /student-dashboard/grammar                                                658 B          88.4 kB
14:44:45.683 ├ ○ /student-dashboard/grammar/analytics                                      8.76 kB         145 kB
14:44:45.683 ├ ○ /student-dashboard/leaderboard                                            1.92 kB         145 kB
14:44:45.684 ├ ○ /student-dashboard/preview                                                4.89 kB         150 kB
14:44:45.684 ├ ○ /student-dashboard/vocabmaster                                            697 B          88.4 kB
14:44:45.684 ├ ○ /student-dashboard/vocabulary                                             6.51 kB         152 kB
14:44:45.684 ├ ○ /student-dashboard/vocabulary-mining                                      5.15 kB         155 kB
14:44:45.684 ├ ○ /student-dashboard/vocabulary-mining/collection                           5.32 kB         192 kB
14:44:45.684 ├ ○ /student-dashboard/vocabulary-mining/practice                             8.53 kB         158 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary-mining/progress                             3.6 kB          153 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary-mining/review                               3.83 kB         154 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/analysis                                    9.55 kB         191 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/categories                                  4.64 kB         186 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/dashboard                                   9.49 kB         182 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/detail                                      4.31 kB         177 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/practice                                    6.41 kB         188 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/progress                                    3.55 kB         176 kB
14:44:45.685 ├ ○ /student-dashboard/vocabulary/review                                      4.27 kB         177 kB
14:44:45.685 ├ ○ /student/auth/login                                                       6.17 kB         188 kB
14:44:45.685 ├ ○ /student/dashboard                                                        697 B           137 kB
14:44:45.685 ├ ƒ /student/test/[testId]                                                    7.18 kB         184 kB
14:44:45.685 ├ ƒ /student/test/[testId]/results                                            4.71 kB         177 kB
14:44:45.685 ├ ƒ /student/test/[testId]/review                                             3.75 kB         176 kB
14:44:45.685 ├ ○ /teacher-dashboard/analytics/reading-comprehension                        3.51 kB         140 kB
14:44:45.685 ├ ○ /terms                                                                    348 B          96.8 kB
14:44:45.685 ├ ○ /test-ai                                                                  2.14 kB        89.9 kB
14:44:45.685 ├ ○ /test-brevo                                                               1.04 kB        88.8 kB
14:44:45.685 ├ ○ /test-generators                                                          3.35 kB        98.9 kB
14:44:45.685 ├ ○ /test-listening-client                                                    1.57 kB         137 kB
14:44:45.685 ├ ○ /tools/crossword                                                          13 kB           154 kB
14:44:45.686 ├ ○ /tools/crossword/result                                                   4.04 kB         116 kB
14:44:45.686 ├ ○ /tools/crossword/test                                                     3.8 kB          107 kB
14:44:45.686 ├ ○ /tools/wordsearch                                                         22.5 kB         118 kB
14:44:45.686 ├ ○ /tutorials                                                                6.25 kB         103 kB
14:44:45.686 ├ ○ /vocab-master                                                             15.3 kB         269 kB
14:44:45.686 ├ ƒ /vocab-master/assignment/[assignmentId]                                   4.31 kB         232 kB
14:44:45.686 ├ ƒ /vocabulary/edit/[id]                                                     1.39 kB         147 kB
14:44:45.686 ├ ○ /vocabulary/new                                                           901 B           146 kB
14:44:45.686 ├ ○ /workbooks/aqa-spanish                                                    2.76 kB        90.5 kB
14:44:45.686 ├ ○ /worksheets                                                               8.04 kB         173 kB
14:44:45.686 ├ ƒ /worksheets/[id]                                                          23 kB           274 kB
14:44:45.686 ├ ○ /worksheets/builder                                                       8.34 kB         145 kB
14:44:45.686 ├ ○ /worksheets/create                                                        5.81 kB         110 kB
14:44:45.686 ├ ○ /worksheets/create/crossword                                              553 B          88.3 kB
14:44:45.686 ├ ○ /worksheets/create/grammar-exercises                                      12.8 kB         120 kB
14:44:45.686 ├ ○ /worksheets/create/listening-comprehension                                7.6 kB          112 kB
14:44:45.686 ├ ○ /worksheets/create/mixed-practice                                         8.51 kB         116 kB
14:44:45.686 ├ ○ /worksheets/create/reading-comprehension                                  9.24 kB         166 kB
14:44:45.686 ├ ○ /worksheets/create/sentence-builder                                       10.8 kB         160 kB
14:44:45.686 ├ ○ /worksheets/create/sentence-builder/result                                8.17 kB         112 kB
14:44:45.687 ├ ○ /worksheets/create/vocabulary-practice                                    8.47 kB         165 kB
14:44:45.687 ├ ○ /worksheets/create/word-search                                            9.56 kB         166 kB
14:44:45.687 ├ ○ /worksheets/create/word-search/result                                     6.88 kB         111 kB
14:44:45.687 ├ ○ /worksheets/create/writing-practice                                       7.62 kB         112 kB
14:44:45.687 ├ ○ /worksheets/my-worksheets                                                 2.85 kB         136 kB
14:44:45.687 ├ ○ /worksheets/public                                                        8.76 kB         158 kB
14:44:45.687 ├ ƒ /worksheets/sentence-builder/[id]                                         8.74 kB         113 kB
14:44:45.687 ├ ○ /youtube/flashcards                                                       971 B           179 kB
14:44:45.687 ├ ƒ /youtube/video/[id]                                                       7.63 kB         197 kB
14:44:45.687 ├ ○ /youtube/videos                                                           6.44 kB         196 kB
14:44:45.687 ├ ○ /youtube/vocabulary                                                       3.1 kB          139 kB
14:44:45.687 ├ ƒ /youtube/youtube-quiz/[id]                                                3.83 kB         152 kB
14:44:45.687 └ ○ /youtube/youtube-videos                                                   2.3 kB          147 kB
14:44:45.687 + First Load JS shared by all                                                 87.7 kB
14:44:45.687   ├ chunks/52117-0bf109c7d8431721.js                                          31.8 kB
14:44:45.687   ├ chunks/fd9d1056-9dfda1883548923a.js                                       53.6 kB
14:44:45.687   └ other shared chunks (total)                                               2.32 kB
14:44:45.687 
14:44:45.687 
14:44:45.687 ƒ Middleware                                                                  63.4 kB
14:44:45.687 
14:44:45.687 ○  (Static)   prerendered as static content
14:44:45.687 ●  (SSG)      prerendered as static HTML (uses getStaticProps)
14:44:45.688 ƒ  (Dynamic)  server-rendered on demand
14:44:45.688 
14:44:47.152 Traced Next.js server files in: 43.057ms
14:44:49.180 Created all serverless functions in: 2.027s
14:44:49.488 Collected static files (public/, static/, .next/static): 206.549ms
14:44:51.818 Build Completed in /vercel/output [4m]
14:44:52.941 Deploying outputs...
14:45:12.746 Deployment completed
14:45:13.786 Creating build cache...