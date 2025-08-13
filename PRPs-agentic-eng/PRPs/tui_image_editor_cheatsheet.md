# TOAST UI Image Editor Cheatsheet

This document provides a concise cheatsheet for integrating and utilizing the TOAST UI Image Editor, focusing on the essential API methods, common patterns, and known pitfalls for the Farcaster Post Scheduler Mini App.

## 1. Installation

```bash
npm install tui-image-editor
# Or yarn add tui-image-editor
```

## 2. Initialization

Initialize the editor by providing a DOM element and configuration options. It's crucial to set `includeUI` and `loadImage` for a complete UI experience.

### Basic Initialization Example (React Component):

```tsx
import React, { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';

interface EditorProps {
  imageUrl?: string;
  onSave: (dataUrl: string) => void;
}

const MyImageEditor: React.FC<EditorProps> = ({ imageUrl, onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<ImageEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      editorInstance.current = new ImageEditor(editorRef.current, {
        includeUI: {
          loadImage: {
            path: imageUrl || '/default.jpg', // Use provided image or a default
            name: 'SampleImage',
          },
          theme: {},
          menu: ['crop', 'filter', 'text'], // Only include necessary menus
          initMenu: 'filter',
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        usageStatistics: false,
      });

      // Event listener for image loaded
      editorInstance.current.on('loadedImage', (response: { naturalWidth: number; naturalHeight: number }) => {
        console.log('Image loaded:', response);
      });

      // Clean up on unmount
      return () => {
        if (editorInstance.current) {
          editorInstance.current.destroy();
          editorInstance.current = null;
        }
      };
    }
  }, [imageUrl]);

  const handleSave = () => {
    if (editorInstance.current) {
      const dataUrl = editorInstance.current.toDataURL(); // Default PNG
      onSave(dataUrl);
    }
  };

  return (
    <div>
      <div ref={editorRef} style={{ width: '100%', height: '500px' }} />
      <button onClick={handleSave}>Save Edited Image</button>
    </div>
  );
};

export default MyImageEditor;
```

### Critical Initialization Notes:

-   **`includeUI`**: Essential for displaying the default UI components (menus, tools).
-   **`loadImage`**: Provide a `path` (URL) and `name` for the initial image. If no `imageUrl` is passed, use a default placeholder like `/default.jpg` (must be in `public/` directory).
-   **CSS Sizing (`cssMaxWidth`, `cssMaxHeight`)**: Crucial for responsive behavior. Set these to control the editor's display size. Do not rely solely on container CSS.
-   **`usageStatistics: false`**: Recommended to disable telemetry.
-   **Cleanup**: Always `destroy()` the editor instance on component unmount to prevent memory leaks.

## 3. Key API Methods

Access these methods via your `editorInstance.current` reference.

### 3.1 Applying Filters

```javascript
// Apply a predefined filter
editorInstance.current.applyFilter('Grayscale', {});
// Apply a custom filter with options
editorInstance.current.applyFilter('ColorFilter', { color: '#000000', alpha: 0.5 });

// Available default filters (check docs for full list and options):
// Grayscale, Sepia, Sepia2, Blur, Sharpen, Emboss, RemoveColor, ColorFilter, etc.
```

### 3.2 Cropping Images

```javascript
// Start crop mode
editorInstance.current.startDrawingMode('CROPPER');

// Set a custom crop zone (optional, usually user interacts with UI)
// editorInstance.current.setCropzoneRect({ left: 10, top: 10, width: 100, height: 100 });

// Apply crop (after user selection)
const cropRect = editorInstance.current.getCropzoneRect();
if (cropRect) {
  editorInstance.current.crop(cropRect).then(() => {
    console.log('Image cropped!');
  });
}

// Stop crop mode
editorInstance.current.stopDrawingMode();
```

### 3.3 Adding Text

```javascript
// Add text object
editorInstance.current.addText('Hello Farcaster!', {
  styles: {
    fill: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  position: {   // Optional: positioning
    x: 0,
    y: 0,
    originX: 'left',
    originY: 'top',
  },
});

// Update selected text properties
// editorInstance.current.changeText('New Text Content');
// editorInstance.current.changeTextStyle(objectId, { fill: '#ff0000' });

// Remove selected text
// editorInstance.current.removeObject(objectId);
```

### 3.4 Exporting Edited Images

```javascript
// Export as Data URL (Base64 encoded PNG by default)
const dataUrl = editorInstance.current.toDataURL();
console.log('Data URL:', dataUrl);

// Export as Data URL with specific format and quality (e.g., JPEG)
const jpegDataUrl = editorInstance.current.toDataURL({
  format: 'jpeg',
  quality: 0.9,
});

// To get a Blob for IPFS upload:
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

const imageBlob = dataURLtoBlob(dataUrl);
// Now imageBlob can be sent to Pinata
```

### 3.5 Resetting the Editor

```javascript
// Reset to original image (removes all edits)
editorInstance.current.clearObjects();
editorInstance.current.loadImage(imageUrl || '/default.jpg', 'SampleImage');
```

## 4. Common Gotchas

-   **CSS & Sizing**: The editor's canvas often requires explicit `cssMaxWidth` and `cssMaxHeight` (or similar) during initialization, and its parent container needs defined dimensions. Responsive resizing can be tricky; handle `window.resize` events if dynamic resizing is needed.
-   **SSR (Server-Side Rendering)**: TOAST UI Image Editor relies on the DOM and Canvas API, which are not available during SSR. Ensure the component is dynamically imported with `ssr: false` in Next.js.
    ```javascript
    // components/DynamicImageEditor.tsx
    import dynamic from 'next/dynamic';

    const DynamicImageEditor = dynamic(() => import('./MyImageEditor'), {
      ssr: false,
    });
    export default DynamicImageEditor;
    ```
-   **Dependencies**: Remember to import both `tui-image-editor.css` and `tui-color-picker.css` for the UI to render correctly.
-   **Image Loading**: Ensure the initial `loadImage.path` is publicly accessible. For local development, place images in the `public/` directory.
-   **Memory Usage**: Large images can consume significant memory client-side. Consider client-side resizing/compression before sending to the editor if performance is an issue.
-   **`toDataURL()` format**: Default is PNG, which can be large. Use `format: 'jpeg'` and `quality` options for smaller file sizes, especially before IPFS upload.
