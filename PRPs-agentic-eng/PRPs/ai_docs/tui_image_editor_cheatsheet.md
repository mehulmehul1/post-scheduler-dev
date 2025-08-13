# TOAST UI Image Editor Cheatsheet

## Initialization

```tsx
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';

const editor = new ImageEditor(container, {
  includeUI: {
    loadImage: { path: '/image.png', name: 'SampleImage' },
    menu: ['crop', 'filter', 'text'],
    initMenu: 'filter',
  },
  cssMaxWidth: 700,
  cssMaxHeight: 500,
  usageStatistics: false,
});
```

## Common Commands

### Filters

```javascript
editor.applyFilter('Grayscale');
editor.applyFilter('ColorFilter', { color: '#ff0000', alpha: 0.5 });
```

### Crop

```javascript
editor.startDrawingMode('CROPPER');
const rect = editor.getCropzoneRect();
await editor.crop(rect);
editor.stopDrawingMode();
```

### Text

```javascript
editor.addText('Hello Farcaster!', {
  styles: { fill: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  position: { x: 10, y: 10 },
});
```

## Export

```javascript
const png = editor.toDataURL();
const jpeg = editor.toDataURL({ format: 'jpeg', quality: 0.9 });

function dataURLtoBlob(dataUrl) {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

const blob = dataURLtoBlob(png);
```

## Troubleshooting

- **Canvas sizing**: Set `cssMaxWidth` and `cssMaxHeight` and give the parent container explicit dimensions. Add a resize handler if the layout changes.
- **SSR**: The editor depends on the DOM. In Next.js, dynamically import the component with `ssr: false`.

```tsx
import dynamic from 'next/dynamic';

const DynamicImageEditor = dynamic(() => import('./MyImageEditor'), { ssr: false });
```
