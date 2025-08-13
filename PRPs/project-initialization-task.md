# Project Initialization Task PRP

context:
  docs:
    - url: postschedule-appbuild.md
      focus: Step 1 – Set Up the Farcaster Mini App
    - url: PRPs/post-scheduler-execution.md
      focus: Required software and environment variables

CREATE .:
  - RUN: npx create-next-app@latest . --ts --eslint --app --src-dir
  - VALIDATE: npm run lint && npm run dev
  - IF_FAIL: ensure Node ≥18 and reinstall dependencies
  - ROLLBACK: git clean -fdx

UPDATE package.json:
  - ADD: @farcaster/miniapp-sdk, tailwindcss, autoprefixer, postcss
  - RUN: npm install @farcaster/miniapp-sdk tailwindcss postcss autoprefixer
  - VALIDATE: npm list @farcaster/miniapp-sdk
  - IF_FAIL: reinstall dependencies
  - ROLLBACK: npm uninstall @farcaster/miniapp-sdk tailwindcss postcss autoprefixer

CREATE tailwind.config.js:
  - RUN: npx tailwindcss init -p
  - UPDATE: set content to './src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'
  - VALIDATE: npm run dev
  - IF_FAIL: verify config paths
  - ROLLBACK: git checkout -- tailwind.config.js postcss.config.js

UPDATE src/app/globals.css:
  - ADD: Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities;)
  - VALIDATE: npm run dev
  - IF_FAIL: ensure directives are correctly placed at top of file
  - ROLLBACK: git checkout -- src/app/globals.css

UPDATE src/app/layout.tsx:
  - ADD: Farcaster mini app metadata (<meta property="fc:frame" content="vNext" />)
  - ADD: Open Graph tags for title and image
  - VALIDATE: npm run build && grep -R "fc:frame" .next | head -n 1
  - IF_FAIL: check metadata syntax and placement
  - ROLLBACK: git checkout -- src/app/layout.tsx

CREATE src/app/page.tsx:
  - IMPLEMENT: placeholder home page linking to post composer
  - VALIDATE: npm run dev and visit http://localhost:3000
  - IF_FAIL: check component export
  - ROLLBACK: git rm src/app/page.tsx

CHECKPOINT:
  - RUN: npm run lint && npm test
  - IF_FAIL: fix lint/test errors before proceeding
