name: "Kamo CESDK Integration PRP (Instagram‑grade Image & Video Editing)"
description: |
  Integrate IMG.LY CreativeEditor SDK (CESDK) into the Kamo Expo app to deliver
  world‑class, Instagram‑like photo and video editing with a native UI and
  high‑performance rendering on iOS and Android. Use expo‑image‑picker for media
  acquisition, CESDK for advanced editing, and expo‑image‑manipulator as a
  minimal native fallback for core transforms (crop/rotate/flip/resize).

  This PRP covers Expo integration requirements (prebuild + EAS Dev Client),
  platform configuration, licensing, UI/UX design, data flow, export pipeline,
  testing, performance, and security. It is designed to slot into the existing
  Kamo Post Scheduler flow and hand edited exports to the Compose/Queue screens
  and the backend media pipeline (Pinata/IPFS) for Farcaster posting via Neynar.

# Goal
- Deliver an Instagram‑quality editor for images and videos inside Kamo with:
  - Cropping, rotation, flipping, resize, aspect ratios.
  - Adjustments: brightness, contrast, saturation, warmth, highlights/shadows.
  - Filters & LUTs, effects and blurs, vignettes, grain.
  - Text with rich typography; shapes and stickers with gesture transforms.
  - Overlays/frames; undo/redo; multi‑step history; templates.
  - For video: trim/split, timeline editing, speed, cover/thumbnail, basic audio.
  - Export presets optimized for Farcaster (size < ~10MB, typical 1080px max).

# Why CESDK
- Native, GPU‑accelerated editing for RN delivering high fidelity and performance.
- Built‑in, customizable mobile UI; extendable toolsets; template support.
- Single RN package `@imgly/editor-react-native` supporting photo and video.
- Commercial licensing with clear guidance on security and privacy.

# References (must read)
- IMG.LY RN overview (LLMs doc):
  https://img.ly/docs/cesdk/react-native/llms-full.txt
- Existing Project Setup (React Native):
  https://img.ly/docs/cesdk/react-native/get-started/react-native/existing-project-b4312d/

# Expo Integration Strategy
- CESDK is a native module and requires native configuration. Expo Go will NOT
  work. Use:
  - Expo Prebuild (to generate `ios/` and `android/`) and
  - EAS Dev Client / EAS Build for development and distribution.
- Managed workflow with config plugins is recommended; start with manual
  prebuild changes, then upstream into a config plugin for reproducibility.

# Minimum Platform Requirements (from IMG.LY docs)
- React Native: 0.73+
- iOS: 16.0+, Swift 5.10 (Xcode 15.4)
- Android: minSdkVersion 24+, Kotlin (Compose plugin if Kotlin ≥ 2.0)

# Deliverables
- Working CESDK editor integrated into `kamo/stickersmash` project.
- New screens/components:
  - `screens/EditorScreen.tsx` (photo/video editor)
  - `components/EditorLauncher.tsx` (wraps picker → CESDK)
  - `hooks/useEditedMedia.ts` (context for edited asset state)
- Export pipeline producing media URIs + metadata suitable for Pinata upload.
- Expo prebuild config and native project settings to satisfy CESDK requirements.
- License key handling and environment wiring.
- Tests (unit + integration) and validation scripts.
- Docs in README and this PRP for setup and usage.

# High‑Level Flow
```mermaid
flowchart LR
  A[Pick media (expo-image-picker)] --> B{Type?}
  B -- Image --> C[Open CESDK (Photo UI)]
  B -- Video --> D[Open CESDK (Video UI)]
  C --> E[Export image]
  D --> F[Export video + cover]
  E --> G[Compress/resize if needed]
  F --> G
  G --> H[ComposeScreen]
  H --> I[Schedule via /api/schedule]
  I --> J[Backend uploads to Pinata/IPFS]
  J --> K[Cron posts via Neynar]
```

# Implementation Plan (dependency‑ordered)
1) Project Setup and Dependencies
- Ensure Expo SDK compatible with RN 0.73+. If not, plan upgrade.
- Install CESDK:
  - `npm install @imgly/editor-react-native`
- Keep existing: `expo-image-picker`, `expo-file-system`, `expo-image-manipulator`.
- Add dev dependencies for EAS Dev Client and prebuild scripting as needed.

2) Expo Prebuild & Native Configuration
- Run prebuild to generate native projects:
  - `npx expo prebuild --clean`
- iOS:
  - Edit `ios/Podfile`: `platform :ios, '16.0'`.
  - `cd ios && pod install`.
- Android:
  - In `android/build.gradle` add IMG.LY maven repository:
    ```gradle
    allprojects {
      repositories {
        maven {
          name "IMG.LY Artifactory"
          url "https://artifactory.img.ly/artifactory/maven"
          mavenContent { includeGroup("ly.img") }
        }
      }
    }
    ```
  - Ensure `minSdkVersion = 24`.
  - If Kotlin ≥ 2.0, add Compose plugin dependency in `build.gradle`:
    ```gradle
    classpath("org.jetbrains.kotlin.plugin.compose:org.jetbrains.kotlin.plugin.compose.gradle.plugin:$kotlinVersion")
    ```
- Build and run with EAS Dev Client (not Expo Go):
  - `eas build --profile development --platform all`
  - Install dev client on devices and run `npx expo start --dev-client`.

3) Licensing & Environment
- Obtain a CESDK license key from IMG.LY.
- Store in env (examples):
  - `CESDK_LICENSE_KEY` (mobile)
- Pass license to the editor per IMG.LY RN API. Do NOT hardcode secrets in repo.
- Document license validation and testing vs production keys.

4) Editor UX & Navigation
- Add an Editor tab/route; integrate with existing tabs and Queue.
- Instagram‑like UI patterns:
  - Bottom dock with tool categories: Crop, Adjust, Filters, Effects, Stickers,
    Text, Shapes, Overlays, Frames, For Video: Timeline, Trim/Split, Speed, Audio.
  - Modal panels for intensity sliders and presets.
  - Pinch‑to‑zoom, pan, rotate gestures on canvas.
  - Undo/redo buttons with history depth display.
- Make the dock configurable using CESDK’s configuration options (native‑side
  customization; keep default initially).

5) Media Acquisition and Hand‑off
- `expo-image-picker` for images and videos (camera and library).
- Detect media type; choose CESDK Photo UI vs Video UI.
- Provide initial aspect presets: 1:1, 4:5, 16:9, 9:16; default 1:1.

6) Export Pipeline
- Export from CESDK with configurable quality/size. Recommended:
  - Images: JPEG/PNG at max 1080 on longest side, ~85% quality JPEG.
  - Video: H.264/AAC where available, target < 10MB for Farcaster; provide 720p
    and 1080p presets; allow cover image export.
- Post‑export safeguard:
  - For oversized outputs, apply a secondary downscale/compress:
    - Images: `expo-image-manipulator` resize/compress.
    - Videos: RN FFmpeg alternative is out of scope; keep CESDK export presets
      conservative.
- Persist exported URI to app state/context for Compose.

7) State Management & Data Contracts
- `hooks/useEditedMedia.ts` maintains `{ uri, type, width, height, duration?, coverUri? }`.
- Compose screen consumes this state; `imageUrl` or `videoUrl` stored in schedule
  object; backend handles upload to Pinata/IPFS and posts via Neynar.
- Extend backend schema as needed to accept `videoUrl` and `coverImageUrl`.

8) Fallback Path
- If CESDK not available (license missing or build without native module),
  present a basic editor using `expo-image-manipulator` for crop/rotate/flip.
- Make it explicit in UI that advanced tools require full build.

9) Validation Gates
- Lint & Typecheck: `npm run lint`, `tsc --noEmit`.
- Build: EAS development build for iOS/Android.
- Feature smoke tests:
  - Pick image → edit (crop/adjust/filter) → export → compose → schedule.
  - Pick video → trim/cover → export → compose → schedule.
- Export QA: Verify outputs below size thresholds; check codec/format support.
- E2E (manual initially): Full flow to Queue and backend.

10) Testing Plan
- Unit: abstraction helpers (export options, resizing decisions, state store).
- Integration: mock CESDK component and test navigation hand‑off.
- Device QA: check performance on low‑end Android; memory spikes; orientation.

11) Performance & UX Guidelines
- Prefer preset aspect ratios; pre‑scale original before CESDK to avoid huge
  textures (e.g., downscale >4000px images before editing).
- Keep export resolution sensible; provide visual quality preview.
- For video, limit max duration/resolution via presets.
- Cache recent exports in `FileSystem.cacheDirectory`; implement cleanup.

12) Security & Privacy
- CESDK runs on‑device; per docs, editing is client‑side. No media uploaded to
  IMG.LY. Validate with product/legal as needed.
- Keep license keys out of VCS; use env and EAS secrets.
- Respect platform privacy: Camera/Photo library permission strings.

13) Documentation
- Update `kamo/stickersmash/README.md`:
  - Dev setup with EAS Dev Client.
  - iOS/Android native changes list.
  - License setup.
  - Known limitations vs Expo Go.

# Success Criteria
- Editors launch on device via Dev Client; photo and video editing both work.
- Exports succeed within target limits and feed into Compose/Queue screens.
- The app passes lint/typecheck and builds via EAS for both platforms.
- Users can complete: pick → edit → schedule → auto‑post.

# Risks & Mitigations
- Expo Go incompatibility → Use Dev Client; document clearly.
- App binary size increases → Optimize asset packs; keep templates optional.
- Performance on low‑end devices → conservative export defaults; downscale.
- Licensing mistakes → centralize license handling; test with trial keys.
- Video transcoding limits → keep bitrate/resolution presets modest; revisit if
  Farcaster lifts media constraints or if backend/video pipeline is added.

# Timeline (suggested)
- Day 1–2: Prebuild + native config + Dev Client builds.
- Day 3–4: Photo editor integration + export pipeline + fallback.
- Day 5–6: Video editor integration + cover export + presets.
- Day 7: QA, polish, docs, validation, PR.
