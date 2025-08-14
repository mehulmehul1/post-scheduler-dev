name: "Post Scheduler Base PRP (TypeScript) — Implementation-Focused"
description: |
  Base PRP for the Farcaster Post Scheduler mini app, instantiated from the TypeScript template and
  pre-populated with essential Context, Milestones, Validation Gates, and Task Matrix.

---

## Goal

**Feature Goal**: Ship a Farcaster mini app that lets users edit images, compose casts, and schedule them for future publication with optional on-chain verification on Base.

**Deliverable**: Production-ready Next.js app (App Router) with image editor, composer + scheduling UI, off-chain scheduler backend (Neynar), optional on-chain path (Base + Chainlink).

**Success Definition**: Users can upload/edit an image, compose a caption, schedule up to 7 days ahead, and see the cast auto-post via Neynar (or on-chain trigger). App embeds correctly in Warpcast/Base App; meets performance and security criteria.

## Why

- Scheduling increases engagement and creator productivity; image editing improves quality and reach.
- Demonstrates Base-compatible mini apps; showcases delegated signer best practices with Neynar.
- Optional on-chain path provides transparency and verification.

## What

User-visible behavior and technical requirements:
- Editor with ≥5 filters, crop, and text overlays (TOAST UI Image Editor)
- Compose cast (text + image) and pick date/time for scheduling
- Off-chain scheduling via backend + Neynar delegated signer
- Optional on-chain schedule metadata on Base; Chainlink Automation for triggers
- Mini app metadata: fc:frame tags + .well-known manifest; Base App compatibility

### Success Criteria

- [ ] Image upload/edit works with ≥5 filters; export produces usable asset (publicly accessible)
- [ ] Schedule cast up to 7 days in advance
- [ ] Auto-publish at scheduled time via Neynar (and/or on-chain trigger)
- [ ] Warpcast/Base App embedding works (manifest + fc:frame validated)
- [ ] No key exposure; delegated signer flow only; rate-limited APIs
- [ ] Performance targets: editor load <2s; Base tx confirm <10s

## All Needed Context

### Documentation & References

```yaml
# MUST READ - repo-local docs
- file: PRPs-agentic-eng/PRPs/post-scheduler-mini-app.md
  why: Full implementation PRP with success criteria, patterns, and validation
  critical: Mirrors this base PRP; use as the authoritative specification

- file: PRPs-agentic-eng/PRPs/post-scheduler-planning.md
  why: Milestones, phased plan, and desired code tree
  critical: Defines dependency-ordered work and delivery phases

- file: PRPs/post-scheduler-validation.md
  why: Concrete validation commands and expected outputs
  critical: Use these to gate each phase and before deployment

- file: PRPs/post-scheduler-execution.md
  why: Setup, run, build, and troubleshooting guide
  critical: Minimizes environment/setup drift

- file: PRPs/post-scheduler-deployment.md
  why: Vercel configuration and CI/CD expectations
  critical: Production readiness and rollback procedures

- file: PRPs/post-scheduler-ux-flows.md
  why: User journey references for editor, scheduling, and queue
  critical: Aligns UI states and edge-case handling

- file: PRPs-agentic-eng/PRPs/contracts/post-scheduler-api-contract.md
  why: API shapes, DTOs, status codes, and integration notes
  critical: Backend/frontend contract for schedule and publish flows

# External specs (conceptual — consult official docs as needed)
- url: https://miniapps.farcaster.xyz/docs/specification
  why: Mini app manifest, actions, and embedding requirements
  critical: Correct fc:frame + manifest required for client rendering

- url: https://www.npmjs.com/package/tui-image-editor
  why: Editor API surface (filters, export) and SSR gotchas
  critical: Proper initialization/config and export flow

- url: https://docs.neynar.com/
  why: Delegated signer and cast publishing
  critical: Secure server-side posting and rate limits

- url: https://docs.pinata.cloud/
  why: IPFS upload (Pinata)
  critical: Public asset URLs and size limits
```

### Known Gotchas

```text
- Farcaster has no native scheduling; server-side delegated signer via Neynar is required
- Base chain IDs: 8453 (mainnet), 84532 (Sepolia); always switch explicitly
- Images must be publicly accessible (IPFS/Pinata) for clients to render
- Mini app requires valid fc:frame tags and .well-known manifest
- Chainlink Automation fees; prototype on Sepolia first
- Enforce image size <10MB; compress before upload
- Never store private keys; use signer delegation and wallet providers
```

## Environment Variables

Define the following environment variables to run the app and backend. A template is provided at kamo/.env.example.

- Required
  - NEYNAR_API_KEY: API key for Neynar Farcaster APIs. Used by server-side publish helpers to post casts via delegated signer.
  - PINATA_JWT: Pinata JWT used for IPFS uploads of images/assets. Must be a bearer token string.
  - CRON_SECRET: Shared secret used to authenticate scheduled/cron publish endpoint(s) (e.g., /api/publish). Generate a strong random string.
  - AUTH_SECRET: Secret for session/token signing and verification (e.g., JWT/HMAC). Generate a strong random string.

- Optional
  - BASE_RPC_URL: Base chain RPC endpoint for on-chain reads/writes when enabling the on-chain path. Example (Alchemy): https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}
  - CDP_API_KEY: Coinbase Developer Platform API key, if integrating CDP services.
  - PAYMASTER_URL: Custom paymaster endpoint if using sponsored transactions / account abstraction.

Notes
- Do not expose secrets to the client. Only NEXT_PUBLIC_* values are safe for client usage; all variables above should remain server-side.
- Ensure these are configured in your local .env and in your hosting provider (e.g., Vercel) Environment Variables.
- See kamo/.env.example for up-to-date variable names and descriptions.

## Milestones

Derived from PRPs-agentic-eng/PRPs/post-scheduler-planning.md

- Milestone 1: Core Mini App & Off-chain Scheduling (V1 MVP)
  - Setup Next.js + mini app basics, Editor, Composer + scheduling UI
  - Backend: /api/schedule (POST/GET) + internal /api/publish (cron)
  - Neynar client helpers; initial schedule queue UI; initial validation

- Milestone 2: On-chain Scheduling Integration (Optional V1, or V1.1)
  - Scheduler.sol (Base Sepolia) + Chainlink Automation
  - Frontend toggle for off-chain vs on-chain; viem integration
  - On-chain testing and error handling

- Milestone 3: Polish, Performance & Production Readiness
  - UI/UX refinements; robust error handling; performance optimization
  - Security review; deployment and monitoring

## Implementation Blueprint

(Use the patterns in PRPs-agentic-eng/PRPs/templates/prp_base_typescript.md and align file layout to the Desired Codebase Tree in planning.)

## Validation Gates

Use PRPs/post-scheduler-validation.md and complement with the template’s Validation Loop.

- Gate 1: Syntax & Styles
  - Commands: npm run lint, npx tsc --noEmit, npm run format
  - Criteria: 0 errors; consistent formatting; strict TS passes

- Gate 2: Unit Tests
  - Commands: npm test -- test/editor.test.tsx, test/scheduler.test.ts, test/api.schedule.test.ts
  - Criteria: All tests pass; meaningful coverage on editor, scheduler logic, and API validation

- Gate 3: Integration & Runtime
  - Commands: npm run dev; curl POST /api/schedule; cron-trigger /api/publish locally
  - Criteria: End-to-end flow succeeds; scheduled items move to posted; no runtime errors

- Gate 4: Embedding & Platform
  - Actions: Validate fc:frame tags and manifest; test in Warpcast/Base App
  - Criteria: Proper render and interactions; image loads from public URL; time zone handling correct

- Gate 5: Performance & Security
  - Checks: Editor load <2s; rate limits on schedule API; no secrets in client; secure CRON endpoint via CRON_SECRET
  - Criteria: Meets perf thresholds; passes a lightweight security review

- Final Build Gate
  - Commands: npm run build; optional bundle analyze; deploy preview on Vercel
  - Criteria: Successful production build; smoke tests pass; monitoring hooks configured

## Task Matrix

Dependency-ordered from planning, focusing on concrete outputs.

- 1. Project Initialization & Mini App Metadata
  - Output: Next.js scaffold; .well-known/farcaster/mini-app-manifest.json; fc:frame tags in page metadata
  - Depends on: None

- 2. Editor Module
  - Output: components/Editor.tsx integrated with TOAST UI; basic UI for filters, crop, text
  - Depends on: 1

- 3. IPFS Uploads
  - Output: lib/pinata.ts with uploadImage(file/blob) -> ipfs URL; .env example update
  - Depends on: 2

- 4. Compose Form + Validation
  - Output: components/ComposeForm.tsx + lib/validation.ts (Zod schemas)
  - Depends on: 2, 3

- 5. Off-chain Scheduling Backend
  - Output: app/api/schedule/route.ts (POST/GET) with validation and in-memory store; app/api/publish/route.ts secured by CRON_SECRET
  - Depends on: 4

- 6. Neynar Client Helpers
  - Output: lib/neynar.ts with postCast helpers; env wiring; error handling
  - Depends on: 5

- 7. Schedule Queue UI
  - Output: components/ScheduleQueue.tsx listing upcoming items and statuses
  - Depends on: 5

- 8. On-chain Option (Optional V1/V1.1)
  - Output: contracts/Scheduler.sol + scripts/deploy.ts; lib/viem.ts; UI toggle in ComposeForm
  - Depends on: 1, 4

- 9. Tests
  - Output: test/editor.test.tsx; test/scheduler.test.ts; test/api.schedule.test.ts
  - Depends on: 2–7

- 10. Deployment & Monitoring
  - Output: Vercel project configured; env vars; preview + production deploy; smoke tests/health check
  - Depends on: 1–9

## Final Validation Checklist (condensed)

- Technical: Lint/type/format clean; tests pass; build succeeds
- Feature: All success criteria met; manual scheduling verified; errors handled
- Code Quality: Typed helpers; consistent patterns; config isolated in lib/
- Docs & Deploy: README updated; manifest + fc:frame validated; Vercel configured

---

## Anti-Patterns to Avoid

- Storing private keys in client; posting from client without server signer
- Large unoptimized editor bundle blocking initial render
- Unbounded retries without backoff; ignoring time zones (always use UTC)
- Creating new patterns when existing ones work; skipping validation

