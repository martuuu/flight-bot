11:26:10 PM: build-image version: d8f371d8c5aeb7c6c730da471200d93918c3981b (noble)
11:26:10 PM: buildbot version: d8f371d8c5aeb7c6c730da471200d93918c3981b
11:26:10 PM: Fetching cached dependencies
11:26:10 PM: Starting to download cache of 474.4MB (Last modified: 2025-07-05 21:48:47 +0000 UTC)
11:26:12 PM: Finished downloading cache in 1.827s
11:26:12 PM: Starting to extract cache
11:26:20 PM: Finished extracting cache in 8.653s
11:26:21 PM: Finished fetching cache in 10.552s
11:26:21 PM: Starting to prepare the repo for build
11:26:21 PM: Preparing Git Reference refs/heads/main
11:26:22 PM: Custom build path detected. Proceeding with the specified path: 'webapp'
11:26:22 PM: Custom publish path detected. Proceeding with the specified path: 'webapp/.next'
11:26:22 PM: Custom functions path detected. Proceeding with the specified path: 'webapp/netlify/functions'
11:26:22 PM: Custom build command detected. Proceeding with the specified command: 'npm run build'
11:26:22 PM: Starting to install dependencies
11:26:23 PM: Started restoring cached python cache
11:26:23 PM: Finished restoring cached python cache
11:26:23 PM: Started restoring cached ruby cache
11:26:23 PM: Finished restoring cached ruby cache
11:26:23 PM: Started restoring cached go cache
11:26:23 PM: Finished restoring cached go cache
11:26:23 PM: Using PHP version
11:26:24 PM: Started restoring cached Node.js version
11:26:28 PM: Finished restoring cached Node.js version
11:26:28 PM: v18.20.8 is already installed.
11:26:28 PM: Now using node v18.20.8 (npm v9.9.4)
11:26:29 PM: Enabling Node.js Corepack
11:26:29 PM: Started restoring cached bun cache
11:26:29 PM: Finished restoring cached bun cache
11:26:29 PM: Started restoring cached build plugins
11:26:29 PM: Finished restoring cached build plugins
11:26:29 PM: WARNING: The environment variable 'NODE_ENV' is set to 'production'. Any 'devDependencies' in package.json will not be installed
11:26:29 PM: Started restoring cached corepack dependencies
11:26:29 PM: Finished restoring cached corepack dependencies
11:26:29 PM: No npm workspaces detected
11:26:29 PM: Started restoring cached node modules
11:26:29 PM: Finished restoring cached node modules
11:26:29 PM: Found npm version (9.9.4) that doesn't match expected (9)
Installing npm version 9
11:26:30 PM: changed 18 packages in 1s
11:26:30 PM: 27 packages are looking for funding
11:26:30 PM:   run `npm fund` for details
11:26:30 PM: npm installed successfully
11:26:31 PM: Installing npm packages using npm version 9.9.4
11:26:31 PM: npm WARN EBADENGINE Unsupported engine {
11:26:31 PM: npm WARN EBADENGINE   package: 'better-sqlite3@12.2.0',
11:26:31 PM: npm WARN EBADENGINE   required: { node: '20.x || 22.x || 23.x || 24.x' },
11:26:31 PM: npm WARN EBADENGINE   current: { node: 'v18.20.8', npm: '9.9.4' }
11:26:31 PM: npm WARN EBADENGINE }
11:26:31 PM: > flight-alerts-webapp@1.0.0 postinstall
11:26:31 PM: > prisma generate
11:26:31 PM: Prisma schema loaded from prisma/schema.prisma
11:26:32 PM: ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 201ms
11:26:32 PM: Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
11:26:32 PM: Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
11:26:32 PM: up to date in 1s
11:26:32 PM: npm packages installed
11:26:32 PM: Successfully installed dependencies
11:26:32 PM: Starting build script
11:26:33 PM: Detected 1 framework(s)
11:26:33 PM: "next" at version "14.2.30"
11:26:33 PM: Section completed: initializing
11:26:35 PM: ​
11:26:35 PM: Netlify Build                                                 
11:26:35 PM: ────────────────────────────────────────────────────────────────
11:26:35 PM: ​
11:26:35 PM: ❯ Version
11:26:35 PM:   @netlify/build 33.5.0
11:26:35 PM: ​
11:26:35 PM: ❯ Flags
11:26:35 PM:   accountId: 66be5c74b5731c377ecdc349
11:26:35 PM:   baseRelDir: true
11:26:35 PM:   buildId: 6869debf4249dd2e8f7db4d7
11:26:35 PM:   deployId: 6869debf4249dd2e8f7db4d9
11:26:35 PM: ​
11:26:35 PM: ❯ Current directory
11:26:35 PM:   /opt/build/repo/webapp
11:26:35 PM: ​
11:26:35 PM: ❯ Config file
11:26:35 PM:   /opt/build/repo/netlify.toml
11:26:35 PM: ​
11:26:35 PM: ❯ Context
11:26:35 PM:   production
11:26:36 PM: ​
11:26:36 PM: ❯ Installing extensions
11:26:36 PM:    - neon
11:26:37 PM: ​
11:26:37 PM: ❯ Using Next.js Runtime - v5.11.4
11:26:37 PM: ​
11:26:37 PM: ❯ Loading extensions
11:26:37 PM:    - neon
11:26:39 PM: Next.js cache restored
11:26:39 PM: ​
11:26:39 PM: build.command from netlify.toml                               
11:26:39 PM: ────────────────────────────────────────────────────────────────
11:26:39 PM: ​
11:26:39 PM: $ npm run build
11:26:39 PM: > flight-alerts-webapp@1.0.0 build
11:26:39 PM: > prisma generate && next build
11:26:39 PM: Prisma schema loaded from prisma/schema.prisma
11:26:39 PM: ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 183ms
11:26:39 PM: Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
11:26:39 PM: Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
11:26:40 PM: ┌─────────────────────────────────────────────────────────┐
11:26:40 PM: │  Update available 5.22.0 -> 6.11.1                      │
11:26:40 PM: │                                                         │
11:26:40 PM: │  This is a major update - please follow the guide at    │
11:26:40 PM: │  https://pris.ly/d/major-version-upgrade                │
11:26:40 PM: │                                                         │
11:26:40 PM: │  Run the following to update                            │
11:26:40 PM: │    npm i --save-dev prisma@latest                       │
11:26:40 PM: │    npm i @prisma/client@latest                          │
11:26:40 PM: └─────────────────────────────────────────────────────────┘
11:26:40 PM:   ▲ Next.js 14.2.30
11:26:40 PM:    Creating an optimized production build ...
11:26:46 PM:  ✓ Compiled successfully
11:26:46 PM:    Skipping linting
11:26:46 PM:    Checking validity of types ...
11:26:53 PM:    Collecting page data ...
11:26:58 PM:    Generating static pages (0/52) ...
11:26:59 PM: Error obteniendo estado de Telegram: n [Error]: Dynamic server usage: Route /api/user/telegram-status couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
11:26:59 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
11:26:59 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
11:26:59 PM:     at d (/opt/build/repo/webapp/.next/server/app/api/user/telegram-status/route.js:1:1606)
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
11:26:59 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
11:26:59 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
11:26:59 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
11:26:59 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
11:26:59 PM:   description: "Route /api/user/telegram-status couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
11:26:59 PM:   digest: 'DYNAMIC_SERVER_USAGE'
11:26:59 PM: }
11:26:59 PM:    Generating static pages (13/52)
11:26:59 PM: [TEST-SYNC] Starting test sync...
11:26:59 PM: [TEST-SYNC] Looking for user with telegramId = "1"
11:26:59 PM: Debug endpoint error: B [Error]: Dynamic server usage: Route /api/debug/production couldn't be rendered statically because it used `request.headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at V (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:21778)
11:26:59 PM:     at Object.get (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:29465)
11:26:59 PM:     at c (/opt/build/repo/webapp/.next/server/app/api/debug/production/route.js:1:524)
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
11:26:59 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
11:26:59 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
11:26:59 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
11:26:59 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854)
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:122:103 {
11:26:59 PM:   description: "Route /api/debug/production couldn't be rendered statically because it used `request.headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
11:26:59 PM:   digest: 'DYNAMIC_SERVER_USAGE'
11:26:59 PM: }
11:26:59 PM: 🔍 DEBUG: Checking auth configuration...
11:26:59 PM: 🔍 DEBUG INFO: {
11:26:59 PM:   "timestamp": "2025-07-06T02:26:58.577Z",
11:26:59 PM:   "providers": [
11:26:59 PM:     {
11:26:59 PM:       "id": "google",
11:26:59 PM:       "name": "Google",
11:26:59 PM:       "type": "oauth"
11:26:59 PM:     },
11:26:59 PM:     {
11:26:59 PM:       "id": "credentials",
11:26:59 PM:       "name": "Credentials",
11:26:59 PM:       "type": "credentials"
11:26:59 PM:     }
11:26:59 PM:   ],
11:26:59 PM:   "googleProvider": {
11:26:59 PM:     "id": "google",
11:26:59 PM:     "name": "Google",
11:26:59 PM:     "type": "oauth",
11:26:59 PM:     "configured": true
11:26:59 PM:   },
11:26:59 PM:   "environment": {
11:26:59 PM:     "NODE_ENV": "production",
11:26:59 PM:     "NEXTAUTH_URL": "https://flight-bot.com",
11:26:59 PM:     "hasGoogleClientId": true,
11:26:59 PM:     "hasGoogleClientSecret": true,
11:26:59 PM:     "googleClientIdLength": 73,
11:26:59 PM:     "googleClientSecretLength": 35
11:26:59 PM:   }
11:26:59 PM: }
11:26:59 PM: Auth debug error: n [Error]: Dynamic server usage: Route /api/auth-debug couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
11:26:59 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
11:26:59 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
11:26:59 PM:     at p (/opt/build/repo/webapp/.next/server/app/api/auth-debug/route.js:1:1595)
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
11:26:59 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
11:26:59 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
11:26:59 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
11:26:59 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
11:26:59 PM:   description: "Route /api/auth-debug couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
11:26:59 PM:   digest: 'DYNAMIC_SERVER_USAGE'
11:26:59 PM: }
11:26:59 PM:    Generating static pages (26/52)
11:26:59 PM: DEBUG - Error: n [Error]: Dynamic server usage: Route /api/debug-alerts couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
11:26:59 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
11:26:59 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
11:26:59 PM:     at d (/opt/build/repo/webapp/.next/server/app/api/debug-alerts/route.js:1:1604)
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
11:26:59 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
11:26:59 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
11:26:59 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
11:26:59 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
11:26:59 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
11:26:59 PM:   description: "Route /api/debug-alerts couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
11:26:59 PM:   digest: 'DYNAMIC_SERVER_USAGE'
11:26:59 PM: }
11:26:59 PM:    Generating static pages (39/52)
11:26:59 PM: [TEST-SYNC] User query result: null
11:26:59 PM: [TEST-SYNC] No test user found
11:26:59 PM:  ✓ Generating static pages (52/52)
11:26:59 PM:    Finalizing page optimization ...
11:26:59 PM:    Collecting build traces ...
11:27:07 PM: Route (app)                              Size     First Load JS
11:27:07 PM: ┌ ○ /                                    20.3 kB         157 kB
11:27:07 PM: ├ ○ /_not-found                          873 B          88.1 kB
11:27:07 PM: ├ ○ /admin/dashboard                     5.36 kB         148 kB
11:27:07 PM: ├ ○ /admin/users                         4.87 kB         156 kB
11:27:07 PM: ├ ƒ /admin/users/[id]                    3.8 kB          113 kB
11:27:07 PM: ├ ƒ /admin/users/[id]/edit               3.21 kB         112 kB
11:27:07 PM: ├ ○ /admin/users/create                  3.23 kB         145 kB
11:27:07 PM: ├ ○ /alerts                              6.04 kB         157 kB
11:27:07 PM: ├ ƒ /alerts/edit/[id]                    4.19 kB         156 kB
11:27:07 PM: ├ ○ /alerts/new                          7.09 kB         149 kB
11:27:07 PM: ├ ƒ /alerts/view/[id]                    4.73 kB         156 kB
11:27:07 PM: ├ ƒ /api/admin/invite                    0 B                0 B
11:27:07 PM: ├ ƒ /api/admin/users                     0 B                0 B
11:27:07 PM: ├ ƒ /api/admin/users/create              0 B                0 B
11:27:07 PM: ├ ƒ /api/alerts                          0 B                0 B
11:27:07 PM: ├ ƒ /api/alerts/[id]                     0 B                0 B
11:27:07 PM: ├ ƒ /api/alerts/[id]/notifications       0 B                0 B
11:27:07 PM: ├ ƒ /api/alerts/details                  0 B                0 B
11:27:07 PM: ├ ƒ /api/alerts/sync-from-bot            0 B                0 B
11:27:07 PM: ├ ƒ /api/auth-debug                      0 B                0 B
11:27:07 PM: ├ ƒ /api/auth/[...nextauth]              0 B                0 B
11:27:07 PM: ├ ƒ /api/auth/resend-verification        0 B                0 B
11:27:07 PM: ├ ƒ /api/auth/signup                     0 B                0 B
11:27:07 PM: ├ ƒ /api/auth/verify-email               0 B                0 B
11:27:07 PM: ├ ƒ /api/bot-alerts                      0 B                0 B
11:27:07 PM: ├ ƒ /api/bot/sync-notifications          0 B                0 B
11:27:07 PM: ├ ƒ /api/clear-cache                     0 B                0 B
11:27:07 PM: ├ ƒ /api/debug-alerts                    0 B                0 B
11:27:07 PM: ├ ○ /api/debug/all-users                 0 B                0 B
11:27:07 PM: ├ ○ /api/debug/auth                      0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/cleanup                   0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/config                    0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/link-manual               0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/oauth                     0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/production                0 B                0 B
11:27:07 PM: ├ ƒ /api/debug/user                      0 B                0 B
11:27:07 PM: ├ ƒ /api/notifications/[id]/read         0 B                0 B
11:27:07 PM: ├ ƒ /api/notifications/clear             0 B                0 B
11:27:07 PM: ├ ƒ /api/reset-db                        0 B                0 B
11:27:07 PM: ├ ƒ /api/telegram/link-simple            0 B                0 B
11:27:07 PM: ├ ƒ /api/telegram/webhook                0 B                0 B
11:27:07 PM: ├ ○ /api/test-sync                       0 B                0 B
11:27:07 PM: ├ ƒ /api/user/telegram-status            0 B                0 B
11:27:07 PM: ├ ƒ /api/user/test-status                0 B                0 B
11:27:07 PM: ├ ƒ /api/users                           0 B                0 B
11:27:07 PM: ├ ƒ /api/users/[id]                      0 B                0 B
11:27:07 PM: ├ ○ /auth-test                           2.82 kB         107 kB
11:27:07 PM: ├ ○ /auth/error                          3.15 kB         112 kB
11:27:07 PM: ├ ○ /auth/signin                         3.65 kB         178 kB
11:27:07 PM: ├ ○ /auth/signup                         4.29 kB         179 kB
11:27:07 PM: ├ ○ /auth/verified                       1.97 kB         106 kB
11:27:07 PM: ├ ○ /dashboard                           6.49 kB         158 kB
11:27:07 PM: ├ ○ /debug                               1.06 kB        97.9 kB
11:27:07 PM: ├ ○ /login                               4.62 kB         141 kB
11:27:07 PM: ├ ○ /profile                             4.27 kB         142 kB
11:27:07 PM: ├ ○ /robots.txt                          0 B                0 B
11:27:07 PM: ├ ○ /sitemap.xml                         0 B                0 B
11:27:07 PM: ├ ○ /telegram-test                       2.98 kB         108 kB
11:27:07 PM: └ ○ /test-telegram                       3.83 kB        98.8 kB
11:27:07 PM: + First Load JS shared by all            87.2 kB
11:27:07 PM:   ├ chunks/117-1425acfd0919a46c.js       31.6 kB
11:27:07 PM:   ├ chunks/fd9d1056-b8c67a073707bac9.js  53.6 kB
11:27:07 PM:   └ other shared chunks (total)          1.95 kB
11:27:07 PM: ○  (Static)   prerendered as static content
11:27:07 PM: ƒ  (Dynamic)  server-rendered on demand
11:27:07 PM: ​
11:27:07 PM: (build.command completed in 28.2s)
11:27:07 PM: Next.js cache saved
11:27:07 PM: Next.js cache saved
11:27:08 PM: ​
11:27:08 PM: Functions bundling                                            
11:27:08 PM: ────────────────────────────────────────────────────────────────
11:27:08 PM: ​
11:27:08 PM: The Netlify Functions setting targets a non-existing directory: netlify/functions
11:27:08 PM: ​
11:27:08 PM: Packaging Functions from .netlify/functions-internal directory:
11:27:08 PM:  - ___netlify-server-handler/___netlify-server-handler.mjs
11:27:08 PM: ​
11:27:09 PM: ​
11:27:09 PM: (Functions bundling completed in 1.7s)
11:27:10 PM: ​
11:27:10 PM: Deploy site                                                   
11:27:10 PM: ────────────────────────────────────────────────────────────────
11:27:10 PM: ​
11:27:10 PM: Starting to deploy site from 'webapp/.next'
11:27:10 PM: Calculating files to upload
11:27:10 PM: 0 new file(s) to upload
11:27:10 PM: 1 new function(s) to upload
11:27:18 PM: Post processing - header rules
11:27:18 PM: Starting post processing
11:27:18 PM: Post processing - redirect rules
11:27:18 PM: Post processing done
11:27:18 PM: Section completed: postprocessing
11:27:19 PM: Site is live ✨
11:27:18 PM: Skipping form detection
11:27:18 PM: Section completed: deploying
11:27:20 PM: Finished waiting for live deploy in 2.285s
11:27:20 PM: Site deploy was successfully initiated
11:27:20 PM: ​
11:27:20 PM: (Deploy site completed in 9.9s)
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 unpipe listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (Use `node --trace-warnings ...` to show where the warning was created)
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 error listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 finish listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 unpipe listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 error listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:22 PM: (node:2056) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 finish listeners added to [Socket]. Use emitter.setMaxListeners() to increase limit
11:27:23 PM: ​
11:27:23 PM: Netlify Build Complete                                        
11:27:23 PM: ────────────────────────────────────────────────────────────────
11:27:23 PM: ​
11:27:23 PM: (Netlify Build completed in 47.3s)
11:27:23 PM: Caching artifacts
11:27:23 PM: Started saving node modules
11:27:23 PM: Finished saving node modules
11:27:23 PM: Started saving build plugins
11:27:23 PM: Finished saving build plugins
11:27:23 PM: Started saving bun cache
11:27:23 PM: Finished saving bun cache
11:27:23 PM: Started saving go cache
11:27:23 PM: Finished saving go cache
11:27:23 PM: Started saving python cache
11:27:23 PM: Finished saving python cache
11:27:23 PM: Started saving ruby cache
11:27:23 PM: Finished saving ruby cache
11:27:23 PM: Started saving corepack cache
11:27:23 PM: Finished saving corepack cache
11:27:23 PM: Started saving emacs cask dependencies
11:27:23 PM: Finished saving emacs cask dependencies
11:27:23 PM: Started saving maven dependencies
11:27:23 PM: Finished saving maven dependencies
11:27:23 PM: Started saving boot dependencies
11:27:23 PM: Finished saving boot dependencies
11:27:23 PM: Started saving rust rustup cache
11:27:23 PM: Finished saving rust rustup cache
11:27:23 PM: Build script success
11:27:23 PM: Section completed: building