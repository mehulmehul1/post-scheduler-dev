# Post Scheduler Execution Guide

This document explains how to set up, run, and build the Post Scheduler mini app.

## Required Software
- **Node.js**: >=18 (tested with v22.18.0)
- **npm**: >=9 (tested with v11.4.2)
- **Git**: >=2.40
- *(Optional)* **nvm**: recommended for managing Node versions

## Environment Variables
Create a `.env.local` file in the project root containing:

```bash
NEYNAR_API_KEY=your_neynar_api_key
FARCASTER_SIGNER=delegated_signer_private_key
PINATA_JWT=your_pinata_jwt
DATABASE_URL=postgres://user:pass@host:5432/dbname
NEXT_PUBLIC_BASE_CHAIN_ID=8453 # Base mainnet
```

Restart the dev server after editing environment variables.

## Installing Dependencies
```bash
npm install
```
**Expected output**: `added <number> packages, audited <number> packages`.

## Running the Development Server
```bash
npm run dev
```
**Expected output**:
- `ready - started server on http://localhost:3000`
- File changes trigger automatic reloads.

## Building for Production
```bash
npm run build
```
**Expected output**:
- `info  - Creating an optimized production build...`
- `Compiled successfully` with assets in `./dist` or `.next`.

## Troubleshooting
- **Node version mismatch**: Use `nvm install 22` or `nvm use` to match the required Node version.
- **Missing environment variables**: Confirm `.env.local` is filled; missing keys cause runtime errors.
- **Port in use**: Run `PORT=3001 npm run dev` or kill the existing process occupying the port.
- **Dependency issues**: Remove `node_modules` and lockfile then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- **API connectivity errors**: Verify internet connection and API keys; inspect logs for HTTP status codes.

## Additional Commands
- **Linting**: `npm run lint`
- **Tests**: `npm test` (ensure test scripts exist)

