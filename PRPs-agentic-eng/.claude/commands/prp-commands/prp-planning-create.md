# PRP: Post Scheduler Mini App Planning

## Overview

This PRP outlines the plan for implementing a Farcaster mini app that allows users to compose and edit posts with an Instagram-like image editor, schedule them for future publication, and integrate with the Base chain for on-chain verification or automation.

## Goals

1. Create a Farcaster mini app with an embedded Instagram-like image editor
2. Implement post scheduling functionality (off-chain and on-chain options)
3. Integrate with Base chain for wallet authentication and potential on-chain storage
4. Ensure compatibility with Warpcast and Base App feeds
5. Meet all specified success criteria for functionality, security, and performance

## Key Features

### Image Editor
- Upload and edit images with filters, cropping, text overlays, and stickers
- Export edited images for attachment to posts
- Integration with TOAST UI Image Editor library

### Post Composition
- Text input for post content
- Attachment of edited images
- Date/time selection for scheduling

### Scheduling
- Off-chain scheduling using backend services and Neynar API
- On-chain scheduling using Base smart contracts and Chainlink Automation
- User-friendly scheduling interface with confirmation and queue view

### Base Integration
- Wallet authentication using Privy or Dynamic
- Network switching to Base (mainnet/testnet)
- Potential on-chain storage of schedules via IPFS and smart contracts

## Technical Implementation

### Project Setup
- Use Next.js as the framework
- Install required libraries: `@farcaster/miniapp-sdk`, `tui-image-editor`, `viem`, `pinata`, `react-datepicker`
- Host on Vercel for deployment

### Image Editor Module
- Create React component for TOAST UI Image Editor
- Implement upload, filter, crop, and text functionalities
- Export edited images to IPFS via Pinata

### Post Composition Module
- Develop form for text input and image attachment
- Integrate date picker for scheduling
- Create preview functionality for composed posts

### Scheduling Logic
- Implement off-chain scheduling with backend and cron jobs
- Develop on-chain scheduling with Base smart contracts
- Integrate Neynar API for post publication

### Integration & UI
- Implement wallet authentication with Privy
- Add Farcaster frame metadata for proper embedding
- Ensure Base App compatibility using MiniKit

## Validation Plan

### Syntax & Style
- Use ESLint and Prettier for code formatting and style checks

### Unit Tests
- Test image filter application
- Test scheduling logic and IPFS upload functionality

### Integration Tests
- Local server testing with curl/Postman
- Verification of scheduled posts in Warpcast
- On-chain transaction confirmation on Base explorer

## Success Criteria

- [ ] Users can upload and edit images with at least 5 filters, crop, and add text
- [ ] Composed casts can be scheduled for future publication (up to 7 days)
- [ ] Scheduled posts auto-publish via Neynar API or on-chain triggers
- [ ] App embeds correctly in Warpcast/Base App feeds
- [ ] On-chain elements function with low gas fees
- [ ] Secure user delegation for posting without key exposure
- [ ] Performance targets met (editor load <2s, transaction confirm <10s)

## Known Gotchas & Considerations

1. Farcaster has no native scheduling; use delegated signers via Neynar
2. Base chain IDs: 8453 (mainnet), 84532 (Sepolia testnet)
3. Image uploads must be public (e.g., IPFS via Pinata)
4. Mini app metadata must include `fc:frame` tags
5. Chainlink Automation may incur fees; test on testnet first
6. Handle Farcaster limits (image size <10MB)
7. Use Farcaster signer for delegation; integrate Privy for EVM wallet