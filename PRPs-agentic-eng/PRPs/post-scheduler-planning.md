# PRP Planning: Post Scheduler Mini App

## Document Overview

This document outlines the comprehensive planning for the "Post Scheduler Mini App" Farcaster mini app, building upon the `post-scheduler-mini-app.md` base PRP. It details the project scope, key features, technical approach, phased milestones, a granular task breakdown with dependencies, and identifies necessary supporting documentation. This plan aims to guide the development process towards a successful one-pass implementation by providing a clear, actionable roadmap for the AI agent.

## Project Scope & Goals

### Feature Goal
Build and deploy a Farcaster mini app that enables users to edit images, compose casts, and schedule them for future publication. The app will support both off-chain scheduling via a backend service and an optional on-chain scheduling/verification mechanism on the Base chain.

### Deliverables
- Fully functional Next.js application.
- Integrated image editor with essential features (filters, crop, text).
- Post composition interface with image attachment and date/time picker.
- Robust backend service for off-chain scheduling and automated posting via Neynar.
- Optional smart contract on Base for on-chain scheduling.
- Complete Farcaster mini app metadata for seamless embedding in clients like Warpcast and Base App.

### Success Definition
The app will be considered successful when users can:
- Upload and edit images effectively within the app.
- Compose and schedule casts up to 7 days in advance.
- Observe scheduled posts appearing automatically on their Farcaster feed at the specified time.
- The app embeds and functions correctly within Warpcast and Base App feeds.
- All on-chain elements (if implemented) operate with low gas fees and confirm within expected times.
- The system handles user delegation securely, without exposing private keys.
- Performance targets (editor load <2s, Base tx confirm <10s) are consistently met.

## Key Features

### Image Editor
- **Functionality**: Upload, apply filters (vintage, sepia, etc.), crop, add text overlays, stickers.
- **Integration**: TOAST UI Image Editor library.
- **Output**: Export edited images as public URLs (IPFS via Pinata).

### Post Composition
- **Interface**: Text input for content, image attachment, date/time selection for scheduling.
- **Preview**: Real-time preview of the composed cast.

### Scheduling
- **Off-chain Option**: Backend service (Node.js/Vercel Serverless) with cron jobs; posts via Neynar API using delegated signers.
- **On-chain Option (Phase 2/Optional for V1)**: Base smart contract for storing schedule metadata (timestamp, IPFS hash); Chainlink Automation for triggering posting.
- **User Interface**: Clear scheduling interface, confirmation, and a viewable queue of scheduled posts.

### Base Integration
- **Wallet Authentication**: Privy or Dynamic for connecting Farcaster and EVM wallets.
- **Network Management**: Automatic switching to Base (mainnet/testnet).
- **Decentralized Storage**: IPFS (Pinata) for image uploads and optional on-chain schedule data.

## Technical Architecture & Stack

-   **Frontend Framework**: Next.js (App Router)
-   **Image Editor**: `tui-image-editor`
-   **Date Picker**: `react-datepicker`
-   **Web3 Libraries**: `viem` (for Base chain interaction), `privy` or `dynamic` (for wallet auth)
-   **Farcaster Integration**: `@farcaster/miniapp-sdk`, `neynar-js` (for API interactions)
-   **IPFS**: `pinata-sdk`
-   **Backend (Off-chain scheduling)**: Node.js (Vercel Serverless Functions)
-   **Smart Contracts (On-chain scheduling)**: Solidity (deployed on Base)
-   **Automation (On-chain)**: Chainlink Automation (for smart contract triggers)
-   **Deployment**: Vercel

## Milestones

### Milestone 1: Core Mini App & Off-chain Scheduling (V1 MVP)
- Project setup and Farcaster mini app basics.
- Functional image editor.
- Post composition with image upload and scheduling.
- Backend for off-chain scheduling and automated posting via Neynar.
- Basic UI for schedule queue.
- Initial validation (lint, unit tests, basic integration).

### Milestone 2: On-chain Scheduling Integration (Optional V1, or V1.1)
- Smart contract development and deployment on Base Sepolia.
- Integration of Chainlink Automation.
- Frontend integration for choosing on-chain scheduling.
- Comprehensive testing for on-chain flow.

### Milestone 3: Polish, Performance & Production Readiness
- UI/UX refinements, error handling improvements.
- Performance optimizations (e.g., image compression, lazy loading editor).
- Comprehensive security audit.
- Final deployment strategy and monitoring.

## Detailed Task Breakdown (Dependency Ordered)

This section provides a granular list of tasks, ordered by their dependencies, to guide the implementation.

### Phase 1: Core Mini App & Off-chain Scheduling (Milestone 1)

**1.1 Project Initialization & Core Setup**
- **Task**: Scaffold Next.js project.
  - *Dependencies*: None
  - *Details*: Use `create-next-app` with TypeScript. Configure ESLint and Prettier.
- **Task**: Configure Farcaster mini app metadata.
  - *Dependencies*: 1.1 Project Initialization
  - *Details*: Create `.well-known/farcaster/mini-app-manifest.json`. Add `fc:frame` Open Graph tags to `app/page.tsx` for initial embedding.
- **Task**: Setup basic styling.
  - *Dependencies*: 1.1 Project Initialization
  - *Details*: Configure `globals.css` and a theme if applicable.

**1.2 Image Editor Module**
- **Task**: Install and integrate `tui-image-editor`.
  - *Dependencies*: 1.1 Project Initialization
  - *Details*: `npm install tui-image-editor`. Create `components/Editor.tsx` to wrap the editor, initialize it, and provide basic UI controls for filters, crop, and text.
- **Task**: Implement image export and IPFS upload via Pinata.
  - *Dependencies*: 1.2.1 `tui-image-editor` integration, Pinata account.
  - *Details*: Create `lib/pinata.ts` for Pinata SDK integration (`uploadImage(file/blob) => ipfsUrl`). Implement `editor.toDataURL()` and conversion to blob/file for upload. Handle `PINATA_JWT` env var.
- **Task**: Create unit tests for image editor functionality.
  - *Dependencies*: 1.2.1 `tui-image-editor` integration
  - *Details*: `test/editor.test.tsx` to verify filters apply, cropping works, and export format is correct.

**1.3 Post Composition Module**
- **Task**: Develop the `ComposeForm` component.
  - *Dependencies*: 1.1 Project Initialization, 1.2.2 Image export.
  - *Details*: Create `components/ComposeForm.tsx` with text input, image attachment UI (displaying edited image preview), and `react-datepicker` for scheduling.
- **Task**: Implement client-side validation for post composition.
  - *Dependencies*: 1.3.1 `ComposeForm`
  - *Details*: Use `zod` for schema validation of text length, image URL format, and timestamp. Create `lib/validation.ts`.

**1.4 Off-chain Scheduling Backend**
- **Task**: Implement `/api/schedule` endpoint.
  - *Dependencies*: 1.3.2 Client-side validation.
  - *Details*: Create `app/api/schedule/route.ts` (POST). Validate incoming payload (text, imageUrl, timestamp, fid). Persist schedule to a temporary in-memory store (for MVP) or integrate with a database (e.g., Supabase/SQLite in future sub-tasks). Enqueue a job (e.g., a simple timestamp check).
- **Task**: Implement Neynar client helpers.
  - *Dependencies*: Neynar API Key.
  - *Details*: Create `lib/neynar.ts` with functions like `postCast(text, imageUrl, fid, signer)`. Handle `NEYNAR_API_KEY` env var.
- **Task**: Implement internal `/api/publish` endpoint.
  - *Dependencies*: 1.4.1 `/api/schedule`, 1.4.2 Neynar client.
  - *Details*: Create `app/api/publish/route.ts` (POST, internal-only, secured by `CRON_SECRET`). This endpoint will be triggered by a cron job. It fetches due schedules, calls `postCast` via Neynar, updates schedule status (e.g., `posted`, `failed`), and logs results.
- **Task**: Configure cron job for `/api/publish`.
  - *Dependencies*: 1.4.3 `/api/publish`
  - *Details*: Set up a Vercel Cron Job or external cron service to hit `app/api/publish` at regular intervals (e.g., every minute).

**1.5 User Interface for Scheduled Posts**
- **Task**: Develop `ScheduleQueue` component.
  - *Dependencies*: 1.4.1 `/api/schedule`.
  - *Details*: Create `components/ScheduleQueue.tsx` to display a list of current and upcoming scheduled posts, their status, and basic details. Fetch data from `api/schedule` (GET).

**1.6 Initial Testing & Deployment (Milestone 1 Validation)**
- **Task**: Write unit tests for scheduling logic.
  - *Dependencies*: 1.4.1 `/api/schedule`.
  - *Details*: `test/scheduler.test.ts` to mock `Date` and verify scheduling conditions.
- **Task**: Write API integration tests.
  - *Dependencies*: 1.4.1 `/api/schedule`.
  - *Details*: `test/api.schedule.test.ts` to test `POST /api/schedule` validation and happy path.
- **Task**: Local development server testing.
  - *Dependencies*: All above tasks.
  - *Details*: Run `npm run dev`. Use `curl` to test `POST /api/schedule`. Manually verify scheduled posts appear in Warpcast (by shortening schedule time for testing).
- **Task**: Deploy to Vercel.
  - *Dependencies*: All above tasks, Vercel account.
  - *Details*: Configure Vercel project, set environment variables. Test `fc:frame` embedding in Warpcast.

### Phase 2: On-chain Scheduling Integration (Milestone 2 - Optional for V1, or V1.1)

**2.1 Smart Contract Development**
- **Task**: Design and implement `Scheduler.sol` smart contract.
  - *Dependencies*: Familiarity with Solidity, `viem` for deployment.
  - *Details*: Contract to store `(timestamp, ipfsHash)` mappings. Emit `Scheduled` event on successful calls. Implement owner-only functions for administration.
- **Task**: Write deployment script for Base Sepolia.
  - *Dependencies*: 2.1.1 `Scheduler.sol`.
  - *Details*: Use Hardhat/Forge/Viem script to deploy contract to Base Sepolia testnet.
- **Task**: Write contract unit tests.
  - *Dependencies*: 2.1.1 `Scheduler.sol`.
  - *Details*: Test `schedulePost` logic, event emission, and access controls.

**2.2 Chainlink Automation Integration**
- **Task**: Configure Chainlink Automation Upkeep.
  - *Dependencies*: 2.1.2 Contract deployed on Sepolia, Chainlink account.
  - *Details*: Create Upkeep that checks due schedules on `Scheduler.sol` and triggers a `performUpkeep` function on the contract.
- **Task**: Implement `performUpkeep` in `Scheduler.sol`.
  - *Dependencies*: 2.2.1 Chainlink Upkeep.
  - *Details*: This function will read due schedules, emit events that a separate off-chain bot (or `api/publish` with on-chain trigger) will pick up.

**2.3 Frontend Integration for On-chain Option**
- **Task**: Integrate `viem` for Base wallet interaction.
  - *Dependencies*: 1.1 Project Initialization.
  - *Details*: Create `lib/viem.ts` for `walletClient`, `publicClient`, network switching (`switchChain({ id: 84532 })` for Sepolia).
- **Task**: Add UI toggle for off-chain vs on-chain scheduling.
  - *Dependencies*: 1.3.1 `ComposeForm`, 2.3.1 `viem` integration.
  - *Details*: Modify `ComposeForm.tsx` to allow user to select scheduling method. If on-chain, prompt for wallet connection and call contract via `viem`.

## Desired Codebase Tree (Refined)

```
post-scheduler-app/
  app/
    layout.tsx
    page.tsx                      # Landing + composer entry point
    api/
      schedule/route.ts           # POST endpoint for scheduling posts
      publish/route.ts            # Internal endpoint triggered by cron for publishing
      # health/route.ts           # Optional health check
  components/
    Editor.tsx                    # TOAST UI Image Editor wrapper
    ComposeForm.tsx               # Post text, image attachment, date picker
    ScheduleQueue.tsx             # Displays scheduled posts
    # AuthButton.tsx              # For Privy/Dynamic wallet connection
  lib/
    farcaster.ts                  # Mini app metadata helpers
    neynar.ts                     # Neynar API client and signer delegation helpers
    pinata.ts                     # IPFS upload utility
    viem.ts                       # Viem setup for Base chain interactions
    validation.ts                 # Zod schemas for request validation
    # db.ts                       # For database connection (e.g., Supabase, SQLite)
  styles/
    globals.css                   # Global CSS
  contracts/
    Scheduler.sol                 # Solidity smart contract for on-chain scheduling
  scripts/
    deploy.ts                     # Script to deploy Scheduler.sol
  test/
    editor.test.tsx               # Unit tests for Editor component
    scheduler.test.ts             # Unit tests for scheduling logic
    api.schedule.test.ts          # Integration tests for API endpoints
    # contracts/Scheduler.test.ts # Unit tests for smart contract
  public/
    default.jpg                   # Default image for editor initialization
  .well-known/
    farcaster/mini-app-manifest.json # Farcaster mini app manifest
  package.json
  next.config.js
  tsconfig.json
  .env.example                    # Environment variables template
  README.md
```

## Risks & Mitigations

| Risk                                     | Mitigation                                                                           |
| :--------------------------------------- | :----------------------------------------------------------------------------------- |
| **Farcaster Delegated Signer Security**  | Use Neynar’s secure delegated signer flow; avoid direct private key handling.        |
| **Image Size/Format Limits**             | Implement client-side image compression; clearly communicate limits to users.        |
| **Base Chain Gas Fees & Network Errors** | Test extensively on Sepolia; display gas estimates; provide clear error messages.    |
| **Cron Job Reliability**                 | Implement robust retry logic for publishing; use monitoring for cron job failures.   |
| **IPFS Pinning Failures**                | Implement retry mechanisms for Pinata uploads; client-side feedback on upload status. |
| **Mini App Embedding Issues**            | Rigorous testing in Warpcast and Base App feeds; validate manifest and `fc:frame` tags. |
| **Scalability (Backend)**                | Design for stateless serverless functions; use scalable database (e.g., Supabase).   |
| **Time Zone Discrepancies**              | Store all timestamps in UTC; convert for display based on user's locale.             |
| **Abuse/Spam Scheduling**                | Implement rate limiting on schedule endpoint; consider Farcaster FID-based limits.   |

## Future Documentation & PRPs Roadmap

This section lists the additional documents and PRPs that will be generated to support the full implementation and execution phases of the project.

### Planning & Execution Specifics
-   `PRPs/post-scheduler-execution.md`: Step-by-step runbook with exact commands for environment setup, `npm install`, `npm run dev`, testing, and deployment.
-   `PRPs/post-scheduler-validation.md`: Detailed, executable validation gates (lint, unit, integration, manual checks), expected outputs, and debugging guides.
-   `PRPs/post-scheduler-security.md`: Threat model, security best practices (e.g., input sanitization, secure env var handling), and security testing.
-   `PRPs/post-scheduler-deployment.md`: Vercel configuration specifics, CI/CD pipeline steps, monitoring setup, and rollback procedures.
-   `PRPs/post-scheduler-ux-flows.md`: Detailed user journey flows, wireframes/mockups (if simple diagrams can be generated), and considerations for empty states, loading, and error UI.

### Curated AI Reference Docs (`PRPs/ai_docs/`)
-   `PRPs/ai_docs/miniapps_spec.md`: Curated excerpts and examples from Farcaster Mini Apps spec (`.well-known/farcaster/mini-app-manifest` structure, `fc:frame` usage with JSON snippets).
-   `PRPs/ai_docs/neynar_cast_api.md`: Exact endpoints/payloads for cast creation, delegated signer flow, sample requests/responses, rate limits, and error mapping.
-   `PRPs/ai_docs/tui_image_editor_cheatsheet.md`: Minimal API needed (init, filters, crop, text, export), code snippets, common gotchas (canvas sizing, SSR).
-   `PRPs/ai_docs/pinata_quickstart.md`: IPFS upload flow (JWT auth, file/blob upload), size limits, return structure, public access requirements.
-   `PRPs/ai_docs/base_minikit_notes.md`: Network IDs (8453/84532), `viem` wallet connect, chain switching, Base App embedding quirks.
-   `PRPs/ai_docs/chainlink_automation_base.md` (if on-chain option pursued): Upkeep pattern for timestamp checks on Base Sepolia, cost considerations, and testing tips.
-   `PRPs/ai_docs/farcaster_signer_delegation.md`: Best practices for delegated signer issuance, storage, rotation, and recovery mechanisms.
-   `PRPs/ai_docs/post-scheduler-api-spec.md`: OpenAPI/JSON Schema for `POST /api/schedule` and internal `/api/publish` (request/response models, status codes, error formats).
-   `PRPs/ai_docs/post-scheduler-data-model.md`: Detailed database schema for `schedules` table (fields, types, indices) and state machine (e.g., `queued`, `due`, `posted`, `failed`).
-   `PRPs/ai_docs/post-scheduler-solidity-spec.md` (if on-chain option pursued): Smart contract interface (functions, events, storage variables), and example `viem` calls for interaction.
