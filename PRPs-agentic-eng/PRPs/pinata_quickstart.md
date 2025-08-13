# Pinata Quickstart Guide (IPFS Uploads)

This document provides a quickstart guide for integrating Pinata for IPFS uploads within the Farcaster Post Scheduler Mini App. It covers authentication, file handling, and important considerations for public access.

## 1. Pinata Account Setup & API Key

1.  **Create Pinata Account**: If you don't have one, sign up at [https://app.pinata.cloud/signup](https://app.pinata.cloud/signup).
2.  **Generate API Key**: Navigate to "API Keys" in your Pinata dashboard. Create a new key with `Pin File` and `Pin JSON` permissions.
3.  **Store JWT**: The most secure way to authenticate with Pinata from a backend or serverless function is using a JWT (JSON Web Token). Store this JWT securely as an environment variable (e.g., `PINATA_JWT`). **Never expose your JWT or API secret on the client-side.**

## 2. Installation

```bash
npm install @pinata/sdk
# Or yarn add @pinata/sdk
```

## 3. Core API: Uploading Files

The primary method for uploading image files to IPFS is `pinFileToIPFS` via the `@pinata/sdk`.

### 3.1 Server-Side `lib/pinata.ts` Example (Recommended)

For security, all Pinata interactions (especially `pinFileToIPFS`) should happen on your backend or a serverless function, not directly from the client. The client should send the image (e.g., as a `Blob` or `Base64`) to your own API endpoint, which then calls Pinata.

```typescript
// lib/pinata.ts
import pinataSDK, { PinataPinResponse } from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT,
});

export async function uploadImageToIPFS(imageBuffer: Buffer, fileName: string): Promise<PinataPinResponse | null> {
  try {
    // Create a Readable stream from the Buffer
    const readableStreamForFile = Readable.from(imageBuffer);
    readableStreamForFile.path = fileName; // Important for Pinata to correctly name the file

    const options = {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: {
        cidVersion: 0, // or 1
      },
    };

    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log('Pinata upload successful:', result.IpfsHash);
    return result;
  } catch (error) {
    console.error('Error uploading image to Pinata:', error);
    // Log detailed error from Pinata if available
    if ((error as any).response) {
      console.error((error as any).response.data);
    }
    return null;
  }
}

// Example of how your API route might use this (e.g., app/api/upload/route.ts)
/*
import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToIPFS } from '../../../lib/pinata';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = imageFile.name || `image-${Date.now()}.png`;

    const pinataResponse = await uploadImageToIPFS(imageBuffer, fileName);

    if (!pinataResponse || !pinataResponse.IpfsHash) {
      return NextResponse.json({ error: 'Failed to upload to IPFS.' }, { status: 500 });
    }

    const ipfsUrl = `ipfs://${pinataResponse.IpfsHash}`;
    // Alternatively: `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`

    return NextResponse.json({ ipfsUrl }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
*/
```

### 3.2 Client-Side Image Conversion for Backend Upload

After editing an image with TOAST UI, you'll get a Data URL (Base64). You need to convert this to a `Blob` or `File` object to send to your backend endpoint.

```javascript
// In your React component (e.g., after editor.toDataURL())
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const editedDataUrl = editorInstance.current.toDataURL(); // From TOAST UI
const imageBlob = dataURLtoBlob(editedDataUrl);

// Then, send this blob to your Next.js API route:
const formData = new FormData();
formData.append('image', imageBlob, 'edited-image.png');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
if (response.ok) {
  console.log('IPFS URL:', data.ipfsUrl);
  // Use data.ipfsUrl for your Farcaster cast
} else {
  console.error('Upload failed:', data.error);
}
```

## 4. Critical Considerations

-   **Public Access**: For Farcaster casts, images MUST be publicly accessible. Pinata ensures this by default after pinning. The `ipfs://<CID>` format is ideal for Farcaster embeds.
-   **Security (JWT)**: **NEVER expose your Pinata JWT or API secret in client-side code.** Always use a backend/serverless function to interact with Pinata.
-   **File Size Limits**: Pinata has limits on individual file sizes (typically tens of MBs for free tiers). Farcaster also has its own limits (images <10MB recommended for casts). Implement client-side compression *before* sending to your backend/Pinata if large images are expected.
-   **Rate Limits**: Be mindful of Pinata API rate limits. Implement exponential backoff for retries if uploads fail due to rate limiting.
-   **Error Handling**: Robust error handling is crucial. Log Pinata API errors (they often include helpful `response.data`) and provide user-friendly feedback in the UI.
-   **CID Version**: `cidVersion: 0` is the default for most use cases and widely supported. `1` offers more features but might have compatibility considerations with older gateways/clients.
