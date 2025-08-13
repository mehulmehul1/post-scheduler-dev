Here’s the extracted implementation brief from the two PRPs, organized by the requested categories.

Feature list
•  Image editing
•  Upload images; apply ≥5 filters (vintage, sepia, etc.), crop, add text overlays, stickers
•  TOAST UI Image Editor integration; export edited image to a public URL (IPFS via Pinata)
•  Post composition
•  Text input, attach edited image, real-time preview
•  Date/time picker for scheduling (react-datepicker)
•  Scheduling options
•  Off-chain: Backend service posts via Neynar using delegated signer; cron-like automation
•  On-chain (optional for V1 / V1.1): Base smart contract stores timestamp + IPFS hash; Chainlink Automation triggers flow
•  Farcaster mini app integration
•  fc:frame metadata and mini-app manifest for Warpcast/Base App embedding and actions
•  Base chain integration
•  Wallet auth (Privy/Dynamic); automatic network switching to Base (8453/84532); viem helpers
•  Scheduled queue UI
•  List of upcoming posts with status; basic details and confirmation
•  Security and performance targets
•  No private key storage; signer delegation
•  Editor loads <2s; Base tx confirms <10s (typical)

Scoped tasks (dependency-ordered)
•  Project setup and metadata
•  Scaffold Next.js (App Router, TS, ESLint/Prettier); styling setup
•  Add fc:frame tags and .well-known/farcaster/mini-app-manifest.json
•  Image editor module
•  Install/integrate tui-image-editor; wrap in Editor.tsx with controls
•  Export to data URL → convert → upload via lib/pinata.ts using Pinata SDK + PINATA_JWT
•  Unit tests for editor behavior (filters, crop, export format)
•  Post composition module
•  Implement ComposeForm.tsx with caption input, image preview, react-datepicker
•  Client-side validation via zod (text length, image URL, ISO8601 timestamp, fid)
•  Off-chain scheduling backend
•  POST /api/schedule: validate payload, persist (in-memory for MVP; DB later), enqueue job
•  lib/neynar.ts: postCast(text, imageUrl, fid, signer) with NEYNAR_API_KEY
•  POST /api/publish (internal, CRON_SECRET-protected): fetch due items, call postCast, update status, log results
•  Configure cron job (e.g., Vercel Cron) to hit /api/publish every minute
•  UI: Schedule queue
•  ScheduleQueue.tsx to show current/upcoming schedules and statuses; GET from schedule data source
•  On-chain (optional V1 / V1.1)
•  contracts/Scheduler.sol: store (timestamp, ipfsHash), emit Scheduled, owner/admin controls
•  Deploy to Base Sepolia; unit tests for contract
•  Chainlink Automation: Upkeep to check due schedules; performUpkeep emits events consumed by off-chain publisher
•  lib/viem.ts; UI toggle for off-chain vs on-chain; wallet connection and chain switching
•  Testing and deployment
•  Unit tests: editor, scheduler logic; API integration tests
•  Local manual verification + Warpcast post validation (shortened schedule for testing)
•  Deploy to Vercel; configure env vars; validate embed in Warpcast/Base App

Validation steps
•  Level 1: Syntax and style
•  npm run lint; npm run format
•  Level 2: Unit tests
•  npm test -- test/editor.test.tsx
•  npm test -- test/scheduler.test.ts
•  npm test -- test/api.schedule.test.ts
•  Level 3: Integration testing
•  npm run dev; curl POST /api/schedule with test payload; verify posting at scheduled time (short delay in dev)
•  If on-chain enabled, confirm tx on Base Sepolia explorer
•  Level 4: Creative and domain-specific
•  Embed validation by sharing hosted URL in a test cast; verify buttons/actions render via mini app manifest + fc:frame
•  Performance: editor load <2s with bundling/lazy-loading
•  Security: no key storage; rate limit /api/schedule
•  Final validation checklist
•  Technical: lint/format clean; unit tests pass; integration verified; env configured on Vercel
•  Feature: success criteria met; manual scheduling and posting verified; clear error handling for invalid date/large image/failed upload
•  Code quality: typed helpers; config isolated; Editor encapsulation
•  Documentation: README for setup/env/deploy; mini app manifest and fc:frame validated; Base App compatibility checked

Acceptance criteria (success criteria + success definition)
•  Users can upload/edit images (≥5 filters), crop, add text, and export usable image to a public URL
•  Users can schedule a cast (text + image) up to 7 days in advance
•  Scheduled posts auto-publish at specified time via Neynar or via on-chain trigger path
•  Mini app embeds correctly in Warpcast and Base App with valid manifest and fc:frame tags
•  Base interactions (if used) succeed with low gas; chain switching handled
•  Secure delegation; no key exposure; robust error handling
•  Performance: editor loads <2s; Base tx confirms <10s typical
•  Optional on-chain: contract stores timestamp + IPFS hash; events/fire automation; successful end-to-end flow

Gotchas and edge cases
•  Farcaster has no native scheduling
•  Must use delegated signers via Neynar; do not post from client; never store private keys
•  Image handling
•  Publicly accessible URLs required (IPFS via Pinata); image size <10MB; compress before upload; Warpcast won’t load local refs
•  Time zones
•  Always store and schedule in UTC; only convert for display; validate future timestamps and max 7 days
•  Cron/automation reliability
•  Ensure /api/publish idempotency; protect with CRON_SECRET; add retries with backoff and dead-letter handling for repeated failures
•  IPFS pinning failures
•  Retries with backoff; clear user feedback on upload status; report errors
•  Base network specifics
•  Explicit chain IDs: 8453 (mainnet), 84532 (Sepolia); enforce switching; handle wallet not connected/wrong network
•  Rate limits and abuse prevention
•  Rate limit /api/schedule; consider FID-based limits; validate content length and image URL
•  Mini app embedding correctness
•  fc:frame tags and manifest must be correct or buttons/actions won’t render; test in Warpcast/Base App
•  Chainlink Automation costs
•  Test on Sepolia first; monitor fee implications
•  Backend scalability
•  Use stateless serverless patterns; plan for DB-backed schedules with indices; avoid long-running tasks
•  Error transparency
•  Surface clear messages for invalid date, too-large images, failed IPFS uploads, network errors, and Neynar/API failures

Architectural notes
•  Overall stack
•  Next.js (App Router), TS; TOAST UI image editor; react-datepicker
•  Farcaster: @farcaster/miniapp-sdk, neynar-js; signer delegation on server
•  IPFS via pinata-sdk; Web3 via viem; wallet auth via Privy/Dynamic
•  Off-chain backend via Vercel serverless; optional Solidity contract on Base; Chainlink Automation
•  Scheduling architecture (off-chain MVP)
•  POST /api/schedule validates and persists schedule entries (in-memory for MVP; DB later)
•  Cron-like scheduler (Vercel Cron) calls POST /api/publish every minute
•  /api/publish fetches due items, posts via Neynar, updates status (queued → due → posted/failed) and logs results
•  Store timestamps in UTC; enforce future-only and max window (e.g., 7 days)
•  Implement retry with capped backoff for transient Neynar/IPFS errors; log failure reasons
•  Scheduling architecture (on-chain path)
•  Scheduler.sol stores timestamp + ipfsHash; emits Scheduled
•  Chainlink Upkeep checks due items and triggers performUpkeep; off-chain worker consumes events and posts via Neynar, or publish endpoint reacts to on-chain triggers
•  Wallet flow via viem; chain switching required; fees displayed; test on Sepolia
•  Data model (DB when added)
•  schedules(id, fid, text, image_url, timestamp, on_chain, status[queued|due|posted|failed], last_error, retry_count, created_at, updated_at)
•  Security
•  No private keys in client; signer delegation only on server
•  Protect internal routes with CRON_SECRET; rate-limit public APIs; validate inputs strictly with zod
•  UI affordances
•  Real-time editor preview; post preview before scheduling
•  Date/time picker with UTC hinting; validation/inline errors
•  Confirmation after scheduling; schedule queue with status badges
•  Toggle for off-chain vs on-chain scheduling (if enabled)
•  Loading/progress indicators for uploads and scheduling; disabled state handling
•  Failure logging and monitoring
•  Log every publish attempt with schedule id, timestamp, outcome, error payloads (sanitized)
•  Track retry_count and last_error; surface failed items in queue UI
•  Use Vercel logs/monitoring; consider alerting for repeated cron failures

This extraction synthesizes both PRPs and prioritizes the MVP off-chain path with clear pathways to the optional on-chain integration on Base.