# Farcaster Mini Apps Specification (Curated Excerpts)

This document provides a curated overview of the Farcaster Mini Apps specification, focusing on the essential aspects for building and embedding mini apps, including the manifest structure and `fc:frame` usage.

## 1. Mini App Manifest (`.well-known/farcaster/mini-app-manifest.json`)

The manifest is a JSON file served at `/.well-known/farcaster/mini-app-manifest.json` from your mini app's domain. It describes your mini app to Farcaster clients, allowing for deeper integration and richer experiences.

### Essential Fields:

-   `name`: Your mini app's name.
-   `version`: Version of the manifest spec (e.g., "1.0").
-   `about`: Short description.
-   `image`: URL to an image representing your app.
-   `author`: Your Farcaster FID or display name.
-   `supportedChains`: Array of chain IDs the app supports (e.g., `8453` for Base mainnet, `84532` for Base Sepolia).
-   `postUrl`: The primary endpoint for frame interactions.
-   `permissions`: Define what user data your app needs (e.g., `fid`, `wallet`).
-   `actions`: Defines custom actions or buttons (not `fc:frame` buttons, but actions within the client).

### Example Manifest:

```json
{
  "name": "Post Scheduler",
  "version": "1.0",
  "about": "Schedule your Farcaster casts with an integrated image editor.",
  "image": "https://yourdomain.com/path/to/icon.png",
  "author": "0xYourFID",
  "supportedChains": [
    "eip155:8453",
    "eip155:84532"
  ],
  "postUrl": "https://yourdomain.com/api/frame",
  "permissions": {
    "fid": true,
    "wallet": true
  },
  "actions": [
    {
      "name": "Schedule New Post",
      "url": "https://yourdomain.com/",
      "method": "POST"
    }
  ]
}
```

### Critical Notes:

-   **Location**: Must be at `/.well-known/farcaster/mini-app-manifest.json`.
-   **HTTPS**: Your domain must use HTTPS.
-   **`supportedChains`**: Use EIP-155 format (e.g., `eip155:8453`).
-   **`postUrl`**: This is where frame POST requests are sent.

## 2. Farcaster Frames (`fc:frame` Meta Tags)

Frames allow for interactive embeds within Farcaster clients. They use Open Graph (`og:`) meta tags, extended with `fc:frame` specific tags.

### Essential Meta Tags in `<head>`:

-   `og:image`: URL of the image displayed in the frame.
-   `og:title`: Title of the frame.
-   `og:description`: Description of the frame.
-   `fc:frame`: Must be `vNext` to indicate a Frame.
-   `fc:frame:image`: URL of the main image for the frame.
-   `fc:frame:post_url`: The URL where button clicks are sent (POST request).
-   `fc:frame:button:1`: Text for the first button.
-   `fc:frame:button:1:action`: Action type for the button (e.g., `post`, `post_redirect`, `tx`, `mint`).
-   `fc:frame:button:2`, `fc:frame:button:3`, `fc:frame:button:4`: Additional buttons.

### Example `<head>` Meta Tags for a Frame:

```html
<head>
  <meta property="og:title" content="Post Scheduler" />
  <meta property="og:image" content="https://yourdomain.com/path/to/frame-preview.png" />
  <meta property="og:description" content="Edit, compose, and schedule your Farcaster casts." />

  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://yourdomain.com/path/to/frame-image.png" />
  <meta property="fc:frame:post_url" content="https://yourdomain.com/api/frame-interaction" />
  <meta property="fc:frame:button:1" content="Start Scheduling" />
  <meta property="fc:frame:button:1:action" content="post" />
  <!-- For an image editor, you might have: -->
  <meta property="fc:frame:button:2" content="Open Editor" />
  <meta property="fc:frame:button:2:action" content="post_redirect" />
  <meta property="fc:frame:button:2:target" content="https://yourdomain.com/editor" />
</head>
```

### Critical Notes:

-   **`post_url`**: This endpoint receives the `FrameActionBody` from Farcaster clients upon button interaction.
-   **`action` types**:
    -   `post`: Regular POST request, stays on the same frame.
    -   `post_redirect`: POSTs, then redirects the client to the `target` URL. Useful for opening mini apps or external links.
    -   `tx`: Initiates an Ethereum transaction.
    -   `mint`: Initiates an NFT mint.
-   **Image Caching**: Farcaster clients cache images aggressively. If you update your frame image, ensure the URL changes or use cache-busting query parameters (`?v=...`).
-   **Dynamic Frames**: Use Next.js Server Components or serverless functions to dynamically generate these meta tags based on user state or frame context.

## 3. Interaction Flow

1.  **User sees frame**: Client fetches `og:image`, `og:title`, etc.
2.  **User clicks button**: Client sends a POST request with `FrameActionBody` to `fc:frame:post_url`.
3.  **Your app responds**: Your endpoint processes the request and returns new `fc:frame` meta tags to update the frame, or a `post_redirect` to take the user to your full mini app.

### `FrameActionBody` Example (received by `post_url`):

```json
{
  "untrustedData": {
    "fid": 123,
    "url": "https://yourdomain.com/frame",
    "messageHash": "0x...",
    "timestamp": 1678886400,
    "network": 8453,
    "buttonIndex": 1,
    "inputText": "User input if available",
    "castId": {
      "fid": 456,
      "hash": "0x..."
    }
  },
  "trustedData": {
    "messageBytes": "0x..."
  }
}
```

This data is essential for understanding user context and responding appropriately.

## 4. MiniKit (Base App Compatibility)

MiniKit ensures your mini app functions optimally within Coinbase Wallet and Base App feeds. While `fc:frame` handles basic embedding, MiniKit addresses specific nuances for Base's ecosystem.

-   **Purpose**: Enhances the user experience and ensures smooth wallet interactions on Base.
-   **Usage**: Primarily handles wallet-related aspects, such as network switching, transaction signing, and displaying correct UI within Base App.
-   **Reference**: Consult Base documentation for specific integration details, especially for debugging within Coinbase Wallet.

## 5. Farcaster Mini App SDK (`@farcaster/miniapp-sdk`)

This SDK provides utilities for interacting with Farcaster client-side features, such as fetching user data or requesting signer permissions.

-   **`MiniApp` class**: Use `new MiniApp()` to interact.
-   **`miniApp.getUser()`**: Get user's FID, wallet address, and other public data.
-   **`miniApp.requestSigner()`**: Request delegated signer permissions for actions like posting casts.

```javascript
import { MiniApp } from '@farcaster/miniapp-sdk';

const miniApp = new MiniApp();

async function getUserData() {
  try {
    const user = await miniApp.getUser();
    console.log('User FID:', user.fid);
    console.log('User Wallet Address:', user.walletAddress);
  } catch (error) {
    console.error('Failed to get user data:', error);
  }
}
getUserData();
```

Remember to host your mini app on a platform that supports HTTPS (like Vercel) and carefully validate your manifest and meta tags.

