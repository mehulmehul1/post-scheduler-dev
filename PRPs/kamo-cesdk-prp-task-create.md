# PRP Task: Integrate CESDK into Kamo (Instagram‑like Image & Video Editor)

name: "kamo-cesdk-prp-task-create"
description: |
  Execute the CESDK integration plan to deliver an Instagram‑grade photo & video
  editing experience in the Kamo Expo app, using:
  - expo-image-picker for acquisition
  - @imgly/editor-react-native (CESDK) for advanced editing
  - expo-image-manipulator as a fallback for core transforms

  This task list is dependency‑ordered and maps directly to the PRP in
  `PRPs/kamo-cesdk-prp.md`.

references:
- CESDK docs (LLMs): https://img.ly/docs/cesdk/react-native/llms-full.txt
- CESDK existing project setup: https://img.ly/docs/cesdk/react-native/get-started/react-native/existing-project-b4312d/
- PRP spec: PRPs/kamo-cesdk-prp.md

requirements:
- React Native 0.73+
- iOS 16.0+ (Swift 5.10 / Xcode 15.4)
- Android minSdkVersion 24
- Expo Prebuild + EAS Dev Client (Expo Go not supported for native CESDK)
- CESDK License Key available to the app at runtime

license_key_location:
- Saved in Expo config:
  - file: `kamo/stickersmash/app.config.ts`
  - key: `expo.extra.EXPO_PUBLIC_CESDK_LICENSE`
- Access at runtime via `expo-constants`:
  ```ts
  import Constants from 'expo-constants';
  export const getCESDKLicense = () =>
    (Constants?.expoConfig?.extra as any)?.EXPO_PUBLIC_CESDK_LICENSE
    ?? (Constants as any)?.manifestExtra?.EXPO_PUBLIC_CESDK_LICENSE
    ?? process.env.EXPO_PUBLIC_CESDK_LICENSE;
  ```

---

## Task 1 — Add CESDK dependency
- Install package:
  - `npm install @imgly/editor-react-native`
- Commit lockfile changes.

Acceptance Criteria
- Package appears in `package.json` and lockfile.
- TypeScript types resolve for `@imgly/editor-react-native`.

## Task 2 — Expo Prebuild & Native Setup
- Run prebuild to generate native projects:
  - `npx expo prebuild --clean`
- iOS:
  - `ios/Podfile`: `platform :ios, '16.0'`
  - `cd ios && pod install`
- Android:
  - `android/build.gradle`: Add IMG.LY maven repository:
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
  - Ensure `minSdkVersion = 24`
  - If Kotlin ≥ 2.0, add compose plugin classpath per docs
- Build EAS Dev Client for device/simulator and run: `npx expo start --dev-client`

Acceptance Criteria
- App launches on iOS/Android via Dev Client without runtime errors.
- Native module for IMGLY is linked (no unresolved symbol errors).

## Task 3 — Configure License Key (runtime)
- Ensure `EXPO_PUBLIC_CESDK_LICENSE` is injected via `app.config.ts` into `expo.extra`.
- Create a helper util to retrieve the license key (see `getCESDKLicense`).

Acceptance Criteria
- `getCESDKLicense()` returns a non‑empty string at runtime on both platforms.
- Editor opens without watermark (per your license level) or with expected trial behavior.

## Task 4 — EditorLauncher component
- file: `kamo/stickersmash/components/EditorLauncher.tsx`
- Responsibilities:
  - Acquire media with `expo-image-picker` (camera/library; images & videos).
  - Decide `SourceType` (IMAGE or VIDEO) from selected asset.
  - Invoke CESDK `IMGLYEditor.openEditor(settings, { source, type }, preset)`.
  - Return exported result(s) to caller.
- Use presets:
  - Images: `EditorPreset.DESIGN` (or Photo preset once selected)
  - Videos: `EditorPreset.VIDEO` (per CESDK capabilities)
- Settings include license key via `getCESDKLicense()` and optional `userId`.

Example (sketch):
```ts
import IMGLYEditor, { EditorPreset, EditorSettingsModel, SourceType } from '@imgly/editor-react-native';
import { getCESDKLicense } from '../lib/cesdk';

export async function openEditorForUri(uri: string, isVideo: boolean) {
  const settings = new EditorSettingsModel({
    license: getCESDKLicense(),
    userId: 'kamo-user',
  });
  const result = await IMGLYEditor.openEditor(
    settings,
    { source: uri, type: isVideo ? SourceType.VIDEO : SourceType.IMAGE },
    isVideo ? EditorPreset.VIDEO : EditorPreset.DESIGN,
  );
  return result;
}
```

Acceptance Criteria
- Tapping an "Edit" entry point opens CESDK for both image and video inputs.
- Cancel and export flows return control without app crashes.

## Task 5 — EditorScreen
- file: `kamo/stickersmash/screens/EditorScreen.tsx`
- Responsibilities:
  - Wrap `EditorLauncher` and maintain local UI (buttons, progress, error states).
  - Configure default aspect ratios (1:1, 4:5, 16:9, 9:16) via the editor UI.
  - Export image/video with size/quality targets:
    - Image: max 1080px longest side, JPEG ~85%
    - Video: H.264/AAC preset; target < ~10MB if feasible; export cover image
  - Hand off exported URI(s) to state layer.

Acceptance Criteria
- Editing completes and component receives exported URIs.
- Exports meet resolution/size targets (manual QA for now).

## Task 6 — State Management: useEditedMedia
- file: `kamo/stickersmash/hooks/useEditedMedia.ts`
- Shape:
  ```ts
  type EditedMedia = { uri: string; type: 'image'|'video'; width?: number; height?: number; duration?: number; coverUri?: string };
  ```
- Provide context/provider; persist selection and last export.
- Use the hook in Compose to show preview and enable scheduling.

Acceptance Criteria
- Compose screen shows edited media preview.
- State survives navigation between screens.

## Task 7 — Backend Contract Alignment
- Extend schedule object to support `videoUrl` and `coverImageUrl` (if not present).
- Validate in `/api/schedule` and list in queue.

Acceptance Criteria
- New posts with video are accepted and shown in the queue.

## Task 8 — Fallback Editor (basic ops)
- If CESDK unavailable (missing license, native link failure), show a fallback
  using `expo-image-manipulator` (crop/rotate/flip/resize only).
- Make the fallback explicit with a banner/toast in UI.

Acceptance Criteria
- Fallback path renders and performs basic operations without crashes.

## Task 9 — Documentation & Dev Onboarding
- Update `kamo/stickersmash/README.md`:
  - Dev Client requirement and build commands
  - Native config changes (iOS/Android)
  - License key setup and `getCESDKLicense()` usage
- Link to `PRPs/kamo-cesdk-prp.md` and CESDK docs.

Acceptance Criteria
- A new developer can follow README to run the editor on device.

## Task 10 — QA & Validation
- Manual smoke tests (image + video): pick → edit → export → compose → schedule.
- Check export formats, size limits, and performance on low‑end Android.
- Verify no crashes on orientation change and background/foreground.

Acceptance Criteria
- All flows work on iOS and Android Dev Client builds.
- Exports can be uploaded by the backend (Pinata) without errors.

---

## Final Acceptance Criteria (for this PRP task)
- CESDK runs inside the app via Dev Client on iOS and Android.
- Image and video editing both function with sensible export presets.
- License key is read at runtime and editor opens successfully.
- Fallback path works when CESDK is unavailable.
- Compose and scheduling flows accept edited media and surface it in the queue.
- Documentation updated; steps reproducible by a new developer.
