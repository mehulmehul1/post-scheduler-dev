# Farcaster Miniapps Specification

This document summarizes key pieces of the emerging Farcaster miniapp spec.

## Manifest structure

Miniapps expose a `miniapp.json` file at the root of their domain. A minimal manifest looks like:

```json
{
  "name": "Example Miniapp",
  "version": "0.0.1",
  "description": "Shows an example frame",
  "authors": [{ "name": "Example Dev", "url": "https://example.com" }],
  "homepage_url": "https://example.com",
  "icon_url": "https://example.com/icon.png",
  "screenshot_url": "https://example.com/screenshot.png",
  "frame": {
    "path": "/",
    "post_url": "https://example.com/api/frame"
  }
}
```

Key fields:

- **name / version** – identify the miniapp.
- **authors** – array of maintainer objects.
- **homepage_url** – canonical landing page.
- **icon_url** and **screenshot_url** – used by clients when listing the app.
- **frame** – object describing the default frame entry point; `path` is served with frame tags and `post_url` handles button actions.

## `fc:frame` tags

Miniapps render frames using standard Farcaster meta tags embedded in HTML.

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://example.com/frame.png" />
<meta property="fc:frame:post_url" content="https://example.com/api/frame" />
<meta property="fc:frame:button:1" content="Open" />
<meta property="fc:frame:button:1:action" content="post" />
```

Common tags:

- `fc:frame` – version identifier.
- `fc:frame:image` – main image to display.
- `fc:frame:post_url` – endpoint for button interactions.
- `fc:frame:button:N` – label for button `N` (1‑4).
- `fc:frame:button:N:action` – `post` or `link` (others are experimental).

## Client quirks

### Warpcast

- Optimized for square images (≈714×714) under 1 MB.
- Supports `post` and `link` actions; other actions may be ignored.
- Caches `miniapp.json` for roughly five minutes—bump the version to force refresh.

### Base App

- Accepts non‑square frame images but may letterbox them.
- Recognizes `fc:frame:button:N:target` for deep links.
- `mint` and other experimental actions are not yet implemented.

