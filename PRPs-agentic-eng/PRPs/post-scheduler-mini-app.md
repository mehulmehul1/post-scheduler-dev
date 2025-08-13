name: "Post Scheduler Mini App (Farcaster + Base) — Implementation PRP v1"
description: |
  Farcaster mini app enabling Instagram-like image editing, post composition, and scheduled publishing. 
  Off-chain scheduling via backend + Neynar; optional on-chain scheduling on Base (Sepolia/Mainnet) with Chainlink Automation.

---

## Goal

**Feature Goal**: Build and ship a Farcaster mini app that lets users edit images, compose casts, and schedule them for future publication, with optional on-chain scheduling/verification on Base.

**Deliverable**: Production-ready Next.js app with:
- Image editor component (TOAST UI) with filters, crop, text overlays
- Post composer with image attachment and date/time scheduling
- Off-chain scheduler backend using Neynar APIs
- Optional Base smart contract + Chainlink Automation path
- Farcaster mini app metadata and Base App compatibility

**Success Definition**: Users can schedule casts (text + image) for a future timestamp and see them post automatically via Neynar or on-chain triggers. App embeds correctly in Warpcast/Base App, meets performance and security criteria.

## User Persona (if applicable)

**Target User**: Farcaster power users (creators, brands, community managers) who plan content and want high-quality posts without leaving the ecosystem.

**Use Case**: Create/edit image, write caption, schedule posting time, and optionally anchor/verify scheduling on Base.

**User Journey**:
1. Open mini app from an embedded link in Warpcast/Base App
2. Authenticate (Farcaster signer delegation; EVM wallet via Privy if using Base)
3. Edit image (filters/crop/text) and compose caption
4. Pick date/time; choose off-chain vs on-chain scheduling
5. Confirm; view scheduled queue
6. Receive confirmation when cast posts at scheduled time

**Pain Points Addressed**:
- Lack of native scheduling in Farcaster
- No built-in image editor for polished content
- Trust/minimization via on-chain scheduling option

## Why

- Business value: Scheduling drives higher engagement; image editing increases content quality and virality.
- Ecosystem value: Demonstrates Base-compatible mini apps that can scale to millions via Coinbase Wallet integration.
- User value: Power tools for creators; automation without exposing keys; optional decentralized auditability.

## What

User-visible behavior and technical requirements:
- Instagram-like editor with at least 5 filters, crop, and text overlays
- Compose cast with text + image attachment
- Schedule for future time (up to 7 days recommended for first release)
- Off-chain scheduling via backend + Neynar delegated signer
- Optional on-chain scheduling on Base (Sepolia/Mainnet) storing IPFS hash + timestamp
- Farcaster mini app metadata (`fc:frame`), manifest, and Base App compatibility (MiniKit)
- Performance: editor loads <2s on broadband; Base tx confirmation <10s typical
- Security: no private key storage; use signer delegation and wallet providers; rate limiting on APIs

### Success Criteria

- [ ] Users can upload and edit images (≥5 filters), crop, and add text; export usable image
- [ ] Users can schedule a cast up to 7 days in advance
- [ ] Scheduled posts auto-publish via Neynar API or on-chain trigger
- [ ] Proper embedding in Warpcast/Base App with mini app metadata
- [ ] Base chain interactions succeed with low gas; network switching handled
- [ ] Secure delegation; no key exposure; robust error handling
- [ ] Performance targets met (editor <2s load; Base tx confirm <10s)

## All Needed Context

### Context Completeness Check

"If someone knew nothing about this codebase, would they have everything needed to implement this successfully?" — Yes, via the references, desired tree, tasks, and validation below.

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://miniapps.farcaster.xyz/docs/guides/sharing
  why: Mini app sharing + embed metadata.
  critical: Ensure Open Graph + fc:frame tags; validate manifest.

- url: https://miniapps.farcaster.xyz/docs/specification
  why: Mini app manifest (.well-known/farcaster/mini-app-manifest) and actions.
  critical: Clients rely on correct manifest for buttons/actions.

- url: https://docs.neynar.com/docs/mini-app-virality-guide
  why: Virality patterns for Farcaster mini apps.
  critical: UX patterns for higher adoption and retention.

- url: https://docs.base.org/base-app/build-with-minikit/debugging
  why: Base App compatibility + debugging.
  critical: Wallet + image handling nuances in Coinbase ecosystem.

- url: https://www.npmjs.com/package/tui-image-editor
  why: TOAST UI Image Editor API and usage.
  critical: Filter names, export methods, canvas constraints.

- url: https://docs.pinata.cloud/
  why: IPFS uploads for edited images via Pinata SDK.
  critical: Public access; use JWT; handle file size limits.

- url: https://blog.privy.io/blog/supercast-case-study
  why: Farcaster power-user scheduling case study (Supercast).
  critical: Patterns for delegated posting and UX expectations.

- url: https://docs.withblaze.app/blaze/product-guides/social-media-management-twitter/post-and-schedule-farcaster-casts
  why: Scheduling casts via tooling; informs backend approach.
  critical: Edge cases and API payload structures.

- url: https://paragraph.com/%40lampphotography/how-to-schedule-casts-with-supercast
  why: Scheduling tutorial; user expectations.
  critical: Time zone, confirmation flows.

- docfile: PRPs-agentic-eng/.claude/commands/prp-commands/prp-planning-create.md
  why: High-level plan and goals to reflect in implementation.
  section: Key Features, Technical Implementation, Validation Plan, Success Criteria

- docfile: postschedule-appbuild.md
  why: High-level build plan; libraries and flow.
  section: Steps 1–4 (setup, editor, scheduling, Base integration)

- docfile: postschedule-vision.md
  why: Goals, why-now, success criteria, gotchas, and validation loop.
  section: What, All Needed Context, Implementation Blueprint
```

### Current Codebase tree

```bash
# This PRP introduces a new Next.js app; integrate as a new package/repo or subfolder.
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
post-scheduler-app/
  app/
    layout.tsx
    page.tsx                      # Landing + composer entry
    editor/page.tsx               # Editor route (optional modal)
    api/
      schedule/route.ts           # POST schedule (off-chain → DB/queue)
      publish/route.ts            # Internal webhook/cron publish
  components/
    Editor.tsx                    # TOAST UI wrapper + controls
    ComposeForm.tsx               # Caption input + attach image + datepicker
    ScheduleQueue.tsx             # List user schedules
  lib/
    farcaster.ts                  # Mini app metadata/helpers
    neynar.ts                     # Neynar client helpers
    pinata.ts                     # IPFS upload helpers
    viem.ts                       # Wallet + Base chain helpers
    validation.ts                 # Zod schemas
  styles/
    globals.css
  contracts/
    Scheduler.sol                 # On-chain scheduling (optional)
  scripts/
    deploy.ts                     # Contract deploy script (Viem/Hardhat/Forge)
  test/
    editor.test.tsx
    scheduler.test.ts
    api.schedule.test.ts
  public/
    default.jpg
  .well-known/
    farcaster/mini-app-manifest.json
  package.json
  next.config.js
  .env.example                    # NEYNAR_KEY, PINATA_JWT, WALLET config
  README.md
```

### Known Gotchas of our codebase & Library Quirks

```text
# CRITICAL: Farcaster has no native scheduling; use delegated signers via Neynar for backend posting.
# CRITICAL: Base chain IDs: 8453 (mainnet), 84532 (Sepolia). Always switch explicitly.
# CRITICAL: Images must be publicly accessible (e.g., IPFS via Pinata); Warpcast won’t load local refs.
# CRITICAL: Mini app metadata requires fc:frame tags and a valid mini-app-manifest.
# CRITICAL: Chainlink Automation on Base can incur fees; test on Sepolia first.
# CRITICAL: Image size <10MB; compress before upload.
# CRITICAL: Never store private keys; use signer delegation and wallet providers.
```

## Implementation Blueprint

### Data models and structure

```ts
// Example Zod schemas for requests
import { z } from 'zod';

export const ScheduleRequestSchema = z.object({
  text: z.string().min(1).max(320),
  imageUrl: z.string().url(),
  timestamp: z.string(), // ISO8601
  fid: z.number().int().positive(),
  onChain: z.boolean().default(false)
});

export type ScheduleRequest = z.infer<typeof ScheduleRequestSchema>;
```

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: INIT Next.js project
  - IMPLEMENT: Scaffold Next.js app (App Router), TypeScript, ESLint, Prettier.
  - NAMING: post-scheduler-app
  - PLACEMENT: repository root or packages/

Task 2: ADD Farcaster mini app metadata
  - IMPLEMENT: .well-known/farcaster/mini-app-manifest.json and page metadata with fc:frame tags.
  - FOLLOW: miniapps.farcaster docs; validate via client preview.

Task 3: IMPLEMENT Editor component
  - IMPLEMENT: components/Editor.tsx wrapping TOAST UI Image Editor with filters, crop, text overlays.
  - EXPORT: Get image as blob/base64; send to Pinata via lib/pinata.ts → returns public URL/ipfs://.

Task 4: IMPLEMENT Compose form
  - IMPLEMENT: components/ComposeForm.tsx with caption input, attach edited image, react-datepicker.
  - VALIDATE: Zod schemas for form submission.

Task 5: IMPLEMENT Off-chain scheduling API
  - IMPLEMENT: app/api/schedule/route.ts (POST) → validate payload, persist schedule (in-memory initially; then DB like Supabase), enqueue job.
  - IMPLEMENT: app/api/publish/route.ts (internal) → triggered by cron to call Neynar cast API with delegated signer.
  - FOLLOW: postschedule-appbuild.md and Neynar API docs patterns.

Task 6: IMPLEMENT Neynar client helpers
  - IMPLEMENT: lib/neynar.ts with typed client; functions postCast(text, imageUrl, fid, signer).
  - CONFIG: NEYNAR_API_KEY in env.

Task 7: IMPLEMENT IPFS upload helpers
  - IMPLEMENT: lib/pinata.ts using Pinata SDK; function uploadImage(file/blob) → cid/url.
  - CONFIG: PINATA_JWT in env; handle size limits.

Task 8: IMPLEMENT Base integration (optional v1; required v1.1)
  - IMPLEMENT: lib/viem.ts for walletClient, chain switching (8453/84532).
  - UI: Toggle for on-chain scheduling.

Task 9: CREATE Scheduler.sol and deploy script (optional v1; required v1.1)
  - IMPLEMENT: function schedulePost(uint256 timestamp, string ipfsHash) emitting Scheduled(fid, timestamp, ipfsHash).
  - AUTOMATION: Integrate Chainlink Automation on Sepolia; bot listens and posts via Neynar.

Task 10: UI for schedule queue
  - IMPLEMENT: components/ScheduleQueue.tsx listing upcoming posts and statuses.

Task 11: TESTS
  - IMPLEMENT: editor.test.tsx (filters apply), scheduler.test.ts (timestamp logic), api.schedule.test.ts (validation + happy path).

Task 12: DEPLOYMENT
  - HOST: Vercel (set env vars). Validate embed in Warpcast and Base App.
```

### Implementation Patterns & Key Details

```ts
// Pattern: Farcaster signer delegation (server-side)
// Store/issue app-specific delegated signer via Neynar; never user private keys.

// Pattern: TOAST UI initialization
// new ImageEditor('#editor', { includeUI: { loadImage: { path: '/default.jpg', name: 'Sample' } }, cssMaxWidth: 700, cssMaxHeight: 500 });

// Critical: Base chain switching
// walletClient.switchChain({ id: 84532 }) for test; 8453 for mainnet.

// Pattern: Publish job
// On schedule tick → fetch due items → post via Neynar → update status → notify UI.
```

### Integration Points

```yaml
CONFIG:
  - add to: .env
  - NEYNAR_API_KEY: "..."
  - PINATA_JWT: "..."
  - NEXT_PUBLIC_BASE_CHAIN_ID: "84532"  # default testnet
  - CRON_SECRET: "..."                  # to protect /api/publish

ROUTES:
  - add: app/api/schedule/route.ts (POST)
  - add: app/api/publish/route.ts (POST; internal/cron)

DATABASE (optional v1):
  - Supabase or SQLite (prisma) for schedules
  - schema: schedules(id, fid, text, image_url, timestamp, on_chain, status)
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
npm run lint
npm run format
```

### Level 2: Unit Tests (Component Validation)

```bash
npm test -- test/editor.test.tsx
npm test -- test/scheduler.test.ts
npm test -- test/api.schedule.test.ts
```

### Level 3: Integration Testing (System Validation)

```bash
npm run dev
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{"text":"Test cast","imageUrl":"ipfs://test","timestamp":"2025-08-13T12:00:00Z","fid":123}' | jq .

# Verify: Cast posts at scheduled time (dev: shorten delay) in Warpcast
# If on-chain enabled, confirm tx on Base Sepolia explorer
```

### Level 4: Creative & Domain-Specific Validation

```bash
# Embed validation: share hosted URL in a test cast; verify buttons/actions render
# Performance: ensure editor loads <2s; optimize bundling and lazy-load editor
# Security: confirm no private keys stored; rate limit schedule API
```

## Final Validation Checklist

### Technical Validation

- [ ] Lint/format clean
- [ ] All unit tests passing
- [ ] Integration flow verified locally
- [ ] Env configured on Vercel; secrets present

### Feature Validation

- [ ] All success criteria met
- [ ] Manual scheduling and posting verified
- [ ] Error cases (invalid date, large image, failed upload) handled with clear messages

### Code Quality Validation

- [ ] Clear naming; typed helpers; minimal side effects
- [ ] Config isolated in `lib/` and `.env`
- [ ] Editor component encapsulated; no leaking canvas state

### Documentation & Deployment

- [ ] README documents setup, env, and deploy
- [ ] Mini app manifest and fc:frame tags validated
- [ ] Base App compatibility checked with MiniKit guidance

---

## Anti-Patterns to Avoid

- ❌ Storing user/private keys or long-lived tokens in client
- ❌ Posting directly from client without server-side signer delegation
- ❌ Large unoptimized editor bundle blocking initial render
- ❌ Unbounded retries on failed publish without backoff
- ❌ Ignoring time zones; always use UTC for scheduling


