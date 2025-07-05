3:46:47 PM: build-image version: d8f371d8c5aeb7c6c730da471200d93918c3981b (noble)
3:46:47 PM: buildbot version: d8f371d8c5aeb7c6c730da471200d93918c3981b
3:46:47 PM: Fetching cached dependencies
3:46:47 PM: Failed to fetch cache, continuing with build
3:46:47 PM: Starting to prepare the repo for build
3:46:47 PM: No cached dependencies found. Cloning fresh repo
3:46:47 PM: git clone --filter=blob:none https://github.com/martuuu/flight-bot
3:46:48 PM: Preparing Git Reference refs/heads/main
3:46:49 PM: Custom build path detected. Proceeding with the specified path: 'webapp'
3:46:49 PM: Custom publish path detected. Proceeding with the specified path: 'webapp/.next'
3:46:49 PM: Custom functions path detected. Proceeding with the specified path: 'webapp/netlify/functions'
3:46:49 PM: Custom build command detected. Proceeding with the specified command: 'npm run build'
3:46:50 PM: Starting to install dependencies
3:46:50 PM: Using PHP version
3:46:51 PM: Downloading and installing node v18.20.8...
3:46:51 PM: Downloading https://nodejs.org/dist/v18.20.8/node-v18.20.8-linux-x64.tar.xz...
3:46:51 PM: Computing checksum with sha256sum
3:46:51 PM: Checksums matched!
3:46:54 PM: Now using node v18.20.8 (npm v10.8.2)
3:46:54 PM: Enabling Node.js Corepack
3:46:54 PM: Started restoring cached build plugins
3:46:54 PM: Finished restoring cached build plugins
3:46:54 PM: WARNING: The environment variable 'NODE_ENV' is set to 'production'. Any 'devDependencies' in package.json will not be installed
3:46:54 PM: Started restoring cached corepack dependencies
3:46:54 PM: Finished restoring cached corepack dependencies
3:46:54 PM: No npm workspaces detected
3:46:54 PM: Started restoring cached node modules
3:46:54 PM: Finished restoring cached node modules
3:46:54 PM: Found npm version (10.8.2) that doesn't match expected (9)
Installing npm version 9
3:46:57 PM: removed 13 packages, and changed 86 packages in 3s
3:46:57 PM: 27 packages are looking for funding
3:46:57 PM:   run `npm fund` for details
3:46:57 PM: npm installed successfully
3:46:57 PM: Installing npm packages using npm version 9.9.4
3:46:57 PM: npm WARN EBADENGINE Unsupported engine {
3:46:57 PM: npm WARN EBADENGINE   package: 'better-sqlite3@12.2.0',
3:46:57 PM: npm WARN EBADENGINE   required: { node: '20.x || 22.x || 23.x || 24.x' },
3:46:57 PM: npm WARN EBADENGINE   current: { node: 'v18.20.8', npm: '9.9.4' }
3:46:57 PM: npm WARN EBADENGINE }
3:48:24 PM: > flight-alerts-webapp@1.0.0 postinstall
3:48:24 PM: > prisma generate
3:48:24 PM: Prisma schema loaded from prisma/schema.prisma
3:48:25 PM: ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 142ms
3:48:25 PM: Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
3:48:25 PM: Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
3:48:25 PM: added 416 packages in 1m
3:48:25 PM: npm packages installed
3:48:25 PM: Successfully installed dependencies
3:48:25 PM: Starting build script
3:48:26 PM: Detected 1 framework(s)
3:48:26 PM: "next" at version "14.2.30"
3:48:26 PM: Section completed: initializing
3:48:27 PM: ​
3:48:27 PM: Netlify Build                                                 
3:48:27 PM: ────────────────────────────────────────────────────────────────
3:48:27 PM: ​
3:48:27 PM: ❯ Version
3:48:27 PM:   @netlify/build 33.5.0
3:48:27 PM: ​
3:48:27 PM: ❯ Flags
3:48:27 PM:   accountId: 66be5c74b5731c377ecdc349
3:48:27 PM:   baseRelDir: true
3:48:27 PM:   buildId: 68697316deea21dfe4beafb6
3:48:27 PM:   deployId: 68697316deea21dfe4beafb8
3:48:28 PM: ​
3:48:28 PM: ❯ Current directory
3:48:28 PM:   /opt/build/repo/webapp
3:48:28 PM: ​
3:48:28 PM: ❯ Config file
3:48:28 PM:   /opt/build/repo/netlify.toml
3:48:28 PM: ​
3:48:28 PM: ❯ Context
3:48:28 PM:   production
3:48:28 PM: ​
3:48:28 PM: ❯ Installing extensions
3:48:28 PM:    - neon
3:49:21 PM: ​
3:49:21 PM: ❯ Loading extensions
3:49:21 PM:    - neon
3:49:22 PM: ​
3:49:22 PM: build.command from netlify.toml                               
3:49:22 PM: ────────────────────────────────────────────────────────────────
3:49:22 PM: ​
3:49:22 PM: $ npm run build
3:49:22 PM: > flight-alerts-webapp@1.0.0 build
3:49:22 PM: > prisma generate && next build
3:49:23 PM: Prisma schema loaded from prisma/schema.prisma
3:49:23 PM: ✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 149ms
3:49:23 PM: Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
3:49:23 PM: Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
3:49:23 PM: ┌─────────────────────────────────────────────────────────┐
3:49:23 PM: │  Update available 5.22.0 -> 6.11.1                      │
3:49:23 PM: │                                                         │
3:49:23 PM: │  This is a major update - please follow the guide at    │
3:49:23 PM: │  https://pris.ly/d/major-version-upgrade                │
3:49:23 PM: │                                                         │
3:49:23 PM: │  Run the following to update                            │
3:49:23 PM: │    npm i --save-dev prisma@latest                       │
3:49:23 PM: │    npm i @prisma/client@latest                          │
3:49:23 PM: └─────────────────────────────────────────────────────────┘
3:49:24 PM: ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
3:49:24 PM:   ▲ Next.js 14.2.30
3:49:24 PM:    Creating an optimized production build ...
3:49:42 PM:  ✓ Compiled successfully
3:49:42 PM:    Skipping linting
3:49:42 PM:    Checking validity of types ...
3:49:50 PM:    Collecting page data ...
3:49:55 PM:    Generating static pages (0/50) ...
3:49:56 PM: [TEST-SYNC] Starting test sync...
3:49:56 PM: [TEST-SYNC] Looking for user with telegramId = "1"
3:49:56 PM: Debug endpoint error: B [Error]: Dynamic server usage: Route /api/debug/production couldn't be rendered statically because it used `request.headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at V (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:21778)
3:49:56 PM:     at Object.get (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:29465)
3:49:56 PM:     at c (/opt/build/repo/webapp/.next/server/app/api/debug/production/route.js:1:524)
3:49:56 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
3:49:56 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
3:49:56 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
3:49:56 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
3:49:56 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
3:49:56 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854)
3:49:56 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:122:103 {
3:49:56 PM:   description: "Route /api/debug/production couldn't be rendered statically because it used `request.headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
3:49:56 PM:   digest: 'DYNAMIC_SERVER_USAGE'
3:49:56 PM: }
3:49:56 PM: DEBUG - Error: n [Error]: Dynamic server usage: Route /api/debug-alerts couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
3:49:56 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
3:49:56 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
3:49:56 PM:     at d (/opt/build/repo/webapp/.next/server/app/api/debug-alerts/route.js:1:1558)
3:49:56 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
3:49:56 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
3:49:56 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
3:49:56 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
3:49:56 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
3:49:56 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
3:49:56 PM:   description: "Route /api/debug-alerts couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
3:49:56 PM:   digest: 'DYNAMIC_SERVER_USAGE'
3:49:56 PM: }
3:49:56 PM:    Generating static pages (12/50)
3:49:56 PM: 🔍 DEBUG: Checking auth configuration...
3:49:56 PM: 🔍 DEBUG INFO: {
3:49:56 PM:   "timestamp": "2025-07-05T18:49:56.139Z",
3:49:56 PM:   "providers": [
3:49:56 PM:     {
3:49:56 PM:       "id": "google",
3:49:56 PM:       "name": "Google",
3:49:56 PM:       "type": "oauth"
3:49:56 PM:     },
3:49:56 PM:     {
3:49:56 PM:       "id": "credentials",
3:49:56 PM:       "name": "Credentials",
3:49:56 PM:       "type": "credentials"
3:49:56 PM:     }
3:49:56 PM:   ],
3:49:56 PM:   "googleProvider": {
3:49:56 PM:     "id": "google",
3:49:56 PM:     "name": "Google",
3:49:56 PM:     "type": "oauth",
3:49:56 PM:     "configured": true
3:49:56 PM:   },
3:49:56 PM:   "environment": {
3:49:56 PM:     "NODE_ENV": "production",
3:49:56 PM:     "NEXTAUTH_URL": "https://flight-bot.com",
3:49:56 PM:     "hasGoogleClientId": true,
3:49:56 PM:     "hasGoogleClientSecret": true,
3:49:56 PM:     "googleClientIdLength": 73,
3:49:56 PM:     "googleClientSecretLength": 35
3:49:56 PM:   }
3:49:56 PM: }
3:49:56 PM: Error getting all users: PrismaClientInitializationError:
3:49:56 PM: Invalid `prisma.user.findMany()` invocation:
3:49:56 PM: Can't reach database server at `localhost:5432`
3:49:56 PM: Please make sure your database server is running at `localhost:5432`.
3:49:56 PM:     at $n.handleRequestError (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:7615)
3:49:56 PM:     at $n.handleAndLogRequestError (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:6623)
3:49:56 PM:     at $n.request (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:6307)
3:49:56 PM:     at async l (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:130:9633)
3:49:56 PM:     at async l (/opt/build/repo/webapp/.next/server/app/api/debug/all-users/route.js:1:533)
3:49:56 PM:     at async /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38411
3:49:56 PM:     at async e_.execute (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:27880)
3:49:56 PM:     at async e_.handle (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:39943)
3:49:56 PM:     at async exportAppRoute (/opt/build/repo/webapp/node_modules/next/dist/export/routes/app-route.js:77:26)
3:49:56 PM:     at async exportPageImpl (/opt/build/repo/webapp/node_modules/next/dist/export/worker.js:175:20) {
3:49:56 PM:   clientVersion: '5.22.0',
3:49:56 PM:   errorCode: undefined
3:49:56 PM: }
3:49:56 PM: [TEST-SYNC] Error: PrismaClientInitializationError:
3:49:56 PM: Invalid `prisma.user.findFirst()` invocation:
3:49:56 PM: Can't reach database server at `localhost:5432`
3:49:56 PM: Please make sure your database server is running at `localhost:5432`.
3:49:56 PM:     at $n.handleRequestError (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:7615)
3:49:56 PM:     at $n.handleAndLogRequestError (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:6623)
3:49:56 PM:     at $n.request (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:121:6307)
3:49:56 PM:     at async l (/opt/build/repo/webapp/node_modules/@prisma/client/runtime/library.js:130:9633)
3:49:56 PM:     at async h (/opt/build/repo/webapp/.next/server/app/api/test-sync/route.js:5:602)
3:49:56 PM:     at async /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38411
3:49:56 PM:     at async e_.execute (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:27880)
3:49:56 PM:     at async e_.handle (/opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:39943)
3:49:56 PM:     at async exportAppRoute (/opt/build/repo/webapp/node_modules/next/dist/export/routes/app-route.js:77:26)
3:49:56 PM:     at async exportPageImpl (/opt/build/repo/webapp/node_modules/next/dist/export/worker.js:175:20) {
3:49:56 PM:   clientVersion: '5.22.0',
3:49:56 PM:   errorCode: undefined
3:49:56 PM: }
3:49:56 PM:    Generating static pages (24/50)
3:49:57 PM: Error obteniendo estado de Telegram: n [Error]: Dynamic server usage: Route /api/user/telegram-status couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
3:49:57 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
3:49:57 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
3:49:57 PM:     at d (/opt/build/repo/webapp/.next/server/app/api/user/telegram-status/route.js:1:1559)
3:49:57 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
3:49:57 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
3:49:57 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
3:49:57 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
3:49:57 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
3:49:57 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
3:49:57 PM:   description: "Route /api/user/telegram-status couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
3:49:57 PM:   digest: 'DYNAMIC_SERVER_USAGE'
3:49:57 PM: }
3:49:57 PM:    Generating static pages (37/50)
3:49:57 PM: Auth debug error: n [Error]: Dynamic server usage: Route /api/auth-debug couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/opt/build/repo/webapp/.next/server/chunks/8948.js:1:37220)
3:49:57 PM:     at d (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:26597)
3:49:57 PM:     at s (/opt/build/repo/webapp/.next/server/chunks/6575.js:25:19198)
3:49:57 PM:     at p (/opt/build/repo/webapp/.next/server/app/api/auth-debug/route.js:1:1548)
3:49:57 PM:     at /opt/build/repo/webapp/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:38417
3:49:57 PM:     at /opt/build/repo/webapp/node_modules/next/dist/server/lib/trace/tracer.js:140:36
3:49:57 PM:     at NoopContextManager.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
3:49:57 PM:     at ContextAPI.with (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
3:49:57 PM:     at NoopTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
3:49:57 PM:     at ProxyTracer.startActiveSpan (/opt/build/repo/webapp/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854) {
3:49:57 PM:   description: "Route /api/auth-debug couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
3:49:57 PM:   digest: 'DYNAMIC_SERVER_USAGE'
3:49:57 PM: }
3:49:57 PM:  ✓ Generating static pages (50/50)
3:49:57 PM:    Finalizing page optimization ...
3:49:57 PM:    Collecting build traces ...
3:50:02 PM: Route (app)                              Size     First Load JS
3:50:02 PM: ┌ ○ /                                    20.3 kB         157 kB
3:50:02 PM: ├ ○ /_not-found                          873 B          88.1 kB
3:50:02 PM: ├ ○ /admin/dashboard                     5.36 kB         148 kB
3:50:02 PM: ├ ○ /admin/users                         4.87 kB         156 kB
3:50:02 PM: ├ ƒ /admin/users/[id]                    3.8 kB          113 kB
3:50:02 PM: ├ ƒ /admin/users/[id]/edit               3.21 kB         112 kB
3:50:02 PM: ├ ○ /admin/users/create                  3.23 kB         145 kB
3:50:02 PM: ├ ○ /alerts                              6.04 kB         157 kB
3:50:02 PM: ├ ƒ /alerts/edit/[id]                    4.19 kB         156 kB
3:50:02 PM: ├ ○ /alerts/new                          7.09 kB         149 kB
3:50:02 PM: ├ ƒ /alerts/view/[id]                    4.73 kB         156 kB
3:50:02 PM: ├ ƒ /api/admin/invite                    0 B                0 B
3:50:02 PM: ├ ƒ /api/admin/users                     0 B                0 B
3:50:02 PM: ├ ƒ /api/admin/users/create              0 B                0 B
3:50:02 PM: ├ ƒ /api/alerts                          0 B                0 B
3:50:02 PM: ├ ƒ /api/alerts/[id]                     0 B                0 B
3:50:02 PM: ├ ƒ /api/alerts/[id]/notifications       0 B                0 B
3:50:02 PM: ├ ƒ /api/alerts/details                  0 B                0 B
3:50:02 PM: ├ ƒ /api/alerts/sync-from-bot            0 B                0 B
3:50:02 PM: ├ ƒ /api/auth-debug                      0 B                0 B
3:50:02 PM: ├ ƒ /api/auth/[...nextauth]              0 B                0 B
3:50:02 PM: ├ ƒ /api/auth/resend-verification        0 B                0 B
3:50:02 PM: ├ ƒ /api/auth/signup                     0 B                0 B
3:50:02 PM: ├ ƒ /api/auth/verify-email               0 B                0 B
3:50:02 PM: ├ ƒ /api/bot-alerts                      0 B                0 B
3:50:02 PM: ├ ƒ /api/bot/sync-notifications          0 B                0 B
3:50:02 PM: ├ ƒ /api/clear-cache                     0 B                0 B
3:50:02 PM: ├ ƒ /api/debug-alerts                    0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/all-users                 0 B                0 B
3:50:02 PM: ├ ○ /api/debug/auth                      0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/cleanup                   0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/link-manual               0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/oauth                     0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/production                0 B                0 B
3:50:02 PM: ├ ƒ /api/debug/user                      0 B                0 B
3:50:02 PM: ├ ƒ /api/notifications/[id]/read         0 B                0 B
3:50:02 PM: ├ ƒ /api/notifications/clear             0 B                0 B
3:50:02 PM: ├ ƒ /api/reset-db                        0 B                0 B
3:50:02 PM: ├ ƒ /api/telegram/link-simple            0 B                0 B
3:50:02 PM: ├ ƒ /api/test-sync                       0 B                0 B
3:50:02 PM: ├ ƒ /api/user/telegram-status            0 B                0 B
3:50:02 PM: ├ ƒ /api/user/test-status                0 B                0 B
3:50:02 PM: ├ ƒ /api/users                           0 B                0 B
3:50:02 PM: ├ ƒ /api/users/[id]                      0 B                0 B
3:50:02 PM: ├ ○ /auth-test                           2.82 kB         107 kB
3:50:02 PM: ├ ○ /auth/error                          3.15 kB         112 kB
3:50:02 PM: ├ ○ /auth/signin                         3.65 kB         178 kB
3:50:02 PM: ├ ○ /auth/signup                         4.29 kB         179 kB
3:50:02 PM: ├ ○ /auth/verified                       1.97 kB         106 kB
3:50:02 PM: ├ ○ /dashboard                           6.49 kB         158 kB
3:50:02 PM: ├ ○ /debug                               1.06 kB        97.9 kB
3:50:02 PM: ├ ○ /login                               4.62 kB         141 kB
3:50:02 PM: ├ ○ /profile                             4.27 kB         142 kB
3:50:02 PM: ├ ○ /robots.txt                          0 B                0 B
3:50:02 PM: ├ ○ /sitemap.xml                         0 B                0 B
3:50:02 PM: ├ ○ /telegram-test                       2.98 kB         108 kB
3:50:02 PM: └ ○ /test-telegram                       3.83 kB        98.8 kB
3:50:02 PM: + First Load JS shared by all            87.2 kB
3:50:02 PM:   ├ chunks/117-1425acfd0919a46c.js       31.6 kB
3:50:02 PM:   ├ chunks/fd9d1056-b8c67a073707bac9.js  53.6 kB
3:50:02 PM:   └ other shared chunks (total)          1.95 kB
3:50:02 PM: ○  (Static)   prerendered as static content
3:50:02 PM: ƒ  (Dynamic)  server-rendered on demand
3:50:02 PM: ​
3:50:02 PM: (build.command completed in 39.7s)
3:50:02 PM: ​
3:50:02 PM: Functions bundling                                            
3:50:02 PM: ────────────────────────────────────────────────────────────────
3:50:02 PM: ​
3:50:02 PM: The Netlify Functions setting targets a non-existing directory: netlify/functions
3:50:02 PM: ​
3:50:02 PM: (Functions bundling completed in 1ms)
3:50:02 PM: ​
3:50:02 PM: Deploy site                                                   
3:50:02 PM: ────────────────────────────────────────────────────────────────
3:50:02 PM: ​
3:50:02 PM: Starting to deploy site from 'webapp/.next'
3:50:02 PM: Calculating files to upload
3:50:02 PM: 250 new file(s) to upload
3:50:02 PM: 0 new function(s) to upload
3:50:03 PM: Starting post processing
3:50:03 PM: Starting to upload
3:50:03 PM: 10% uploaded
3:50:03 PM: 20% uploaded
3:50:03 PM: 30% uploaded
3:50:03 PM: 40% uploaded
3:50:03 PM: 50% uploaded
3:50:03 PM: 60% uploaded
3:50:03 PM: 70% uploaded
3:50:03 PM: 80% uploaded
3:50:03 PM: 90% uploaded
3:50:03 PM: 100% uploaded
3:50:03 PM: Section completed: deploying
3:50:03 PM: Site deploy was successfully initiated
3:50:03 PM: ​
3:50:03 PM: (Deploy site completed in 1.6s)
3:50:04 PM: Post processing done
3:50:04 PM: Section completed: postprocessing
3:50:04 PM: Skipping form detection
3:50:04 PM: Post processing - header rules
3:50:04 PM: Post processing - redirect rules
3:50:04 PM: Site is live ✨
3:50:04 PM: ​
3:50:04 PM: Netlify Build Complete                                        
3:50:04 PM: ────────────────────────────────────────────────────────────────
3:50:04 PM: ​
3:50:04 PM: (Netlify Build completed in 1m 36.4s)
3:50:04 PM: Caching artifacts
3:50:04 PM: Started saving node modules
3:50:04 PM: Finished saving node modules
3:50:04 PM: Started saving build plugins
3:50:04 PM: Finished saving build plugins
3:50:04 PM: Started saving bun cache
3:50:05 PM: Finished saving bun cache
3:50:05 PM: Started saving go cache
3:50:08 PM: Finished saving go cache
3:50:08 PM: Started saving python cache
3:50:08 PM: Finished saving python cache
3:50:08 PM: Started saving ruby cache
3:50:10 PM: Finished saving ruby cache
3:50:10 PM: Started saving corepack cache
3:50:10 PM: Finished saving corepack cache
3:50:10 PM: Started saving emacs cask dependencies
3:50:10 PM: Finished saving emacs cask dependencies
3:50:10 PM: Started saving maven dependencies
3:50:10 PM: Finished saving maven dependencies
3:50:10 PM: Started saving boot dependencies
3:50:10 PM: Finished saving boot dependencies
3:50:10 PM: Started saving rust rustup cache
3:50:10 PM: Finished saving rust rustup cache
3:50:10 PM: Build script success
3:50:10 PM: Section completed: building
3:50:29 PM: Uploading Cache of size 464.7MB
3:50:30 PM: Section completed: cleanup
3:50:30 PM: Finished processing build request in 3m43.442s