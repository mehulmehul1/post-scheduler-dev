+name: "Kamo Expo App Base PRP — Implementation-Focused"
+description: |
+  Plan to convert the existing Kamo Next.js prototype into a cross-platform
+  Expo application that delivers Instagram-like image editing and scheduled
+  posting to Farcaster and Base. Uses the Expo tutorial series and the
+  StickerSmash example as the foundation.
+
+---
+
+## Goal
+
+**Feature Goal**: Ship an Expo-based mobile app where creators can edit images,
+compose casts, and schedule them for future publication to Farcaster and Base.
+
+**Deliverable**: Expo project scaffold in `kamo/stickersmash` extended with Kamo
+services for scheduling and posting.
+
+**Success Definition**: Users can pick a photo, apply stickers/filters, schedule
+post time, and the cast publishes automatically through existing Kamo backend
+flows.
+
+## User Persona (if applicable)
+
+**Target User**: Farcaster creators who post visual content and want to manage
+posting cadence on mobile.
+
+**Use Case**: Capture or pick an image, apply quick edits like Instagram, add a
+caption, and schedule for later.
+
+**User Journey**:
+1. Launch mobile app.
+2. Pick or capture image.
+3. Edit with stickers/filters.
+4. Enter caption and schedule date/time.
+5. Receive confirmation that cast will post automatically.
+
+**Pain Points Addressed**:
+- No first-class mobile scheduler for Farcaster.
+- Limited lightweight image editing before posting.
+
+## Why
+
+- Expands Kamo from web prototype to full mobile experience, increasing reach.
+- Reuses proven Expo patterns, reducing bootstrapping time.
+- Aligns UX with familiar Instagram-style editing to lower learning curve.
+
+## What
+
+User-visible behavior and technical requirements:
+- Expo app shell using StickerSmash components for image picking and stickers.
+- Scheduling UI integrated with existing Kamo backend routes.
+- Instagram-like editing flow (stickers, basic filters, crop).
+- Post metadata saved locally until scheduled time.
+- Support for Base chain actions when on-chain posting is enabled.
+
+### Success Criteria
+
+- [ ] App builds and runs on iOS, Android, and web via Expo.
+- [ ] Image selection and sticker overlay work consistently.
+- [ ] Scheduling requests hit Kamo backend and persist.
+- [ ] Optional Base transaction path toggled via settings.
+
+## All Needed Context
+
+### Documentation & References
+
+```yaml
+- url: https://docs.expo.dev/tutorial/introduction/
+  why: Step-by-step Expo fundamentals, navigation, and platform tooling
+  critical: Ensures correct project structure and Metro bundler usage
+- file: kamo/stickersmash/README.md
+  why: Describes included image picker and sticker components used as base
+  pattern: Expo router + component layout
+  gotcha: Requires `npx expo start` for dev; assets live under `assets/`
+- file: kamo/lib/pinata.ts
+  why: Existing IPFS upload helper for public image URLs
+  pattern: Uses Pinata JWT to pin assets for Farcaster consumption
+  gotcha: Needs adaptation for React Native fetch
+- file: PRPs/post-scheduler-base-prp.md
+  why: High-level requirements for scheduler and Farcaster flows
+  critical: Maintains parity between web and mobile implementations
+```
+
+### Current Codebase tree (run `tree`)
+
+```bash
+$ tree -L 2 -I node_modules kamo
+.
+├── app
+├── components
+├── lib
+├── public
+├── stickersmash
+└── test
+```
+
+### Desired Codebase tree with files to be added and responsibility of file
+
+```bash
+kamo/            # Expo app base
+│   ├── app/                 # Expo Router pages
+│   ├── components/          # Shared UI primitives (ImageViewer, EmojiPicker)
+│   ├── lib/                 # New: scheduler + pinata adapters for React Native
+│   └── screens/             # New: EditorScreen, ScheduleScreen
+└── shared/                  # New: Cross-platform utilities reused by web/mobile
+```
+
+### Known Gotchas of our codebase & Library Quirks
+
+```python
+# Expo requires Metro bundler; Next.js tooling cannot build the mobile app
+# React Native fetch/file APIs differ from browser; update pinata.ts accordingly
+# Kamo backend endpoints expect JSON; ensure scheduling requests are authenticated
+```
+
+## Implementation Blueprint
+
+### Data models and structure
+
+Define portable models for scheduled posts shared between web and mobile.
+
+```typescript
+// shared/types.ts
+export interface ScheduledPost {
+  imageUri: string;
+  caption: string;
+  scheduledAt: string; // ISO timestamp
+  onChain: boolean;
+}
+```
+
+### Implementation Tasks (ordered by dependencies)
+
+```yaml
+Task 1: CONVERT stickersmash into Kamo mobile shell
+  - IMPLEMENT: rename default App entry, set project name to Kamo
+  - FOLLOW pattern: kamo/stickersmash/app/_layout.tsx for router setup
+  - PLACEMENT: kamo/stickersmash/
+
+Task 2: CREATE stickersmash/lib/scheduler.ts
+  - IMPLEMENT: functions to POST to Kamo /api/schedule
+  - FOLLOW pattern: existing kamo/lib/notification-client.ts for fetch wrapper
+  - DEPENDENCIES: ScheduledPost model
+
+Task 3: CREATE stickersmash/screens/EditorScreen.tsx and ScheduleScreen.tsx
+  - IMPLEMENT: image editing using EmojiSticker, scheduling form
+  - FOLLOW pattern: stickersmash/components/* for UI primitives
+  - DEPENDENCIES: scheduler.ts
+
+Task 4: MODIFY stickersmash/components/ImageViewer.tsx
+  - INTEGRATE: cropping and filter options
+  - FIND pattern: Instagram-like editor requirements
+
+Task 5: MODIFY stickersmash/app/(tabs)/index.tsx
+  - INTEGRATE: navigation to EditorScreen and ScheduleScreen
+  - DEPENDENCIES: Editor and scheduler modules
+```
+
+## Validation
+
+### Level 1: Syntax & Static Analysis
+
+```bash
+cd kamo/stickersmash
+npm install
+npm run lint
+npx tsc --noEmit
+```
+
+### Level 2: Runtime & Integration
+
+```bash
+npx expo start --web
+# interact: pick image, add sticker, schedule
+curl -X POST http://localhost:3000/api/schedule -d '{"test":true}'
+```
+
+### Level 3: Mobile Testing
+
+```bash
+eas build --profile development --platform ios
+# or
+expo run:android
+```
+
+## Final Validation Checklist
+
+### Technical Validation
+- [ ] Lint passes in web and mobile workspaces
+- [ ] Expo app runs on iOS, Android, and web
+- [ ] Scheduling API reachable from device/emulator
+
+### Feature Validation
+- [ ] Image editing mirrors Instagram basics
+- [ ] Scheduled cast appears in Farcaster after trigger
+
+### Documentation & Deployment
+- [ ] README updated with mobile instructions
+- [ ] EAS configuration documented for production builds
+
+---
+
+## Anti-Patterns to Avoid
+
+- ❌ Mixing Next.js and Expo build pipelines in same folder
+- ❌ Storing images locally without pinning to IPFS
+- ❌ Using any-typed APIs without Zod validation
