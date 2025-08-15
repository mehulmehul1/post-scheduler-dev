# Kamo Stickersmash

Expo project for integrating IMG.LY CreativeEditor SDK (CESDK) to provide
Instagram-like image and video editing.

## Setup

1. Install dependencies and the CESDK package:

   ```sh
   npm install
   ```

2. Provide a CESDK license key via environment variable. An example key is
   included in `.env.example`:

   ```sh
   cp .env.example .env
   # or manually export
   export EXPO_PUBLIC_CESDK_LICENSE="a8PZoZwm4PCZnD328R07uOr96GFbhitja_Roxk8A1ExiEaSZ4E_itV6T7RYdjB9v"
   ```

3. The license key is injected by `app.config.ts` and can be retrieved at runtime
   using `getCESDKLicense()` from `lib/cesdk.ts`.

4. Use `openEditorForUri` from `components/EditorLauncher.tsx` to launch the
   editor for an image or video URI.

The project requires running in an Expo Dev Client. See PRPs/kamo-cesdk-prp.md
for full integration details.
