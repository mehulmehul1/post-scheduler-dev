## Goal

Implement a Farcaster mini app that enables users to compose and edit posts (casts) with an Instagram-like image editor, schedule them for future publication, and integrate with the Base chain for on-chain verification or automation of the scheduling (e.g., storing schedules as events or triggering posts via smart contracts). The app should embed seamlessly in Farcaster clients like Warpcast and be compatible with the Base App for rendering in feeds.

## Why

- Enhance user engagement on Farcaster by providing advanced social features like image editing and scheduling, which are not native, allowing users to create polished content without leaving the ecosystem.
- Leverage Base's low-cost L2 for decentralized elements, such as on-chain scheduling to ensure trustless execution and potential monetization (e.g., via NFTs or tokens for scheduled posts).
- Drive viral growth through mini app distribution in social feeds, as seen in successful Farcaster mini apps like Farcade or Henlo Kart, reaching millions via Coinbase Wallet integration.
- Address pain points in web3 social: Immediate posting limits creativity; scheduling allows better timing for engagement, while editing tools mimic Web2 apps like Instagram for broader appeal.
- Business value: Position as a power tool for Farcaster users (e.g., creators, brands), potentially monetized via premium features or integrations with protocols like Zora for NFT-ified posts.

## What

A interactive mini app accessible via Farcaster embeds, featuring:
- Image editor: Upload/edit images with filters, crop, text overlays, stickers (Instagram-style).
- Post composition: Add text, embeds, and edited images to a cast.
- Scheduling: Select future date/time; store off-chain (backend) or on-chain (Base smart contract) for automated posting.
- Base integration: Use for wallet auth, on-chain storage (e.g., IPFS hashes via Pinata), and automation (e.g., Chainlink for triggers).

### Success Criteria

- [ ] Users can upload and edit an image with at least 5 filters, crop, and text addition, exporting as a attachable file/URL.
- [ ] Composed casts can be scheduled for a future time (e.g., up to 7 days), with confirmation and viewable queue.
- [ ] Scheduled posts auto-publish via Neynar API or on-chain trigger, appearing in user's Farcaster feed.
- [ ] App embeds correctly in Warpcast/Base App feeds, with buttons for "Edit Image" and "Schedule Post".
- [ ] On-chain elements: Schedules stored on Base testnet/mainnet, with low gas fees (<0.01 ETH equivalent).
- [ ] Security: User delegation for posting without exposing keys; handle errors like invalid dates or failed uploads.
- [ ] Performance: Editor loads in <2s; scheduling transaction confirms in <10s on Base.

## All Needed Context

### Documentation & References

- url: https://miniapps.farcaster.xyz/docs/guides/sharing
  why: Guide for making mini apps embeddable with meta tags for images and actions, similar to Open Graph.

- url: https://miniapps.farcaster.xyz/docs/specification
  why: Specification for publishing metadata (.well-known/farcaster/mini-app-manifest) to integrate deeply with clients.

- url: https://docs.neynar.com/docs/mini-app-virality-guide
  why: Best practices for designing viral user experiences in Farcaster mini apps using Neynar infrastructure.

- url: https://docs.base.org/base-app/build-with-minikit/debugging
  why: Debugging tips for Base-compatible mini apps, ensuring images load and wallet integrations work.

- url: https://miniapps.farcaster.xyz/
  why: Overview of Farcaster Mini Apps for native-like distribution to users.

- url: https://www.npmjs.com/package/tui-image-editor
  why: TOAST UI Image Editor library for Instagram-like features (filters like vintage/sepia, crop, text, drawing).

- url: https://docs.pinata.cloud/
  why: IPFS upload for images; use SDK for client-side pinning of edited files.

- url: https://percs.app/blog/7-tactics-farcaster/
  why: Tactics for engagement on Farcaster, including post balancing and embeds for scheduling apps.

- url: https://blog.privy.io/blog/supercast-case-study
  why: Case study on Supercast for Farcaster power users, including post scheduling features.

- url: https://docs.withblaze.app/blaze/product-guides/social-media-management-twitter/post-and-schedule-farcaster-casts
  why: Guide to posting and scheduling Farcaster casts via Blaze tool.

- url: https://paragraph.com/%40lampphotography/how-to-schedule-casts-with-supercast
  why: Tutorial on scheduling casts using Supercast.xyz, a paid Farcaster client.

- file: src/components/Editor.tsx (hypothetical in project)
  why: Integrate TOAST UI: Initialize with `new ImageEditor('#editor', { includeUI: { loadImage: { path: 'default.jpg' } } });` and apply filters like `editor.applyFilter('vintage')`.

- doc: https://github.com/hummusonrails/farcaster-arbitrum-miniapp-starter
  why: Starter kit for Farcaster mini apps on EVM chains (adapt for Base).

- doc: https://base.mirror.xyz/V396L2doSesY_qokAIYZnVwMloDvcg1CQzWX05p3Ty4
  why: Guide to building Farcaster Frames (mini apps) on Base.

### Known Gotchas

# CRITICAL: Farcaster has no native scheduling; use delegated signers via Neynar for backend posting to avoid key exposure.

# CRITICAL: Base chain ID is 8453 (mainnet), 84532 (Sepolia testnet); always switch networks with `walletClient.switchChain({ id: 8453 })`.

# CRITICAL: Image uploads must be public (e.g., IPFS via Pinata); Warpcast doesn't support local refs.

# CRITICAL: Mini app metadata must include `fc:frame` tags for buttons/actions; verify manifest at /.well-known/farcaster/mini-app-manifest.

# CRITICAL: For on-chain scheduling, Chainlink Automation may incur fees; test on testnet to avoid high costs.

# CRITICAL: Handle Farcaster limits: Casts support embeds but image size <10MB; use compression in editor.

# CRITICAL: User auth: Use Farcaster signer for delegation; integrate Privy for EVM wallet on Base.

## Implementation Blueprint

1. **Setup Project**: Use Next.js starter; install `@farcaster/miniapp-sdk`, `tui-image-editor`, `viem`, `pinata`, `react-datepicker`.
   - Host on Vercel; add meta tags for Farcaster embedding.

2. **Image Editor Module**:
   - Component: Render canvas with TOAST UI; buttons for upload, filters (vintage, sepia), crop, text.
   - Export: `editor.toDataURL()` to base64; upload to Pinata for IPFS CID: `const upload = await pinata.upload.public.file(file);`.

3. **Post Composition**:
   - Form: Text input, attach edited image URL, date picker for schedule.
   - Preview: Render mock cast with embed.

4. **Scheduling Logic**:
   - Off-chain: Send to backend (Node.js/Vercel); use cron to post via Neynar `/v2/cast` at timestamp.
   - On-chain: Deploy Base contract: `function schedulePost(uint timestamp, string memory ipfsHash)`.
     - Use Viem: `contract.write.schedulePost([timestamp, hash])`.
     - Automation: Chainlink Upkeep to check timestamps and emit events; bot listens to post.

5. **Integration & UI**:
   - Wallet: Privy for Farcaster + Base auth.
   - Embed: Add `fc:frame` for actions like "Schedule Now".
   - Base App compat: Use MiniKit; add experimental tags like "swap" if applicable.

6. **Deployment**: Test in Warpcast; verify on Base Sepolia.

## Validation Loop

### Level 1: Syntax & Style

eslint . --fix
prettier --write .

### Level 2: Unit Tests

npm test -- tests/editor.test.js  # Test image filter application
npm test -- tests/scheduler.test.js  # Mock scheduling and IPFS upload

### Level 3: Integration Test

# Start local server
npm run dev

# Simulate post: Use curl or Postman to hit /schedule endpoint
curl -X POST http://localhost:3000/api/schedule -H "Content-Type: application/json" -d '{"text": "Test cast", "imageUrl": "ipfs://test", "timestamp": "2025-08-13T12:00:00Z", "fid": 123}'

# Verify in Warpcast: Cast appears after scheduled time
# On-chain: Check Base explorer for transaction confirmation