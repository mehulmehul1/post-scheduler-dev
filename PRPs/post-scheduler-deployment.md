# Post Scheduler Deployment

## Vercel Configuration
- **Project Setup**: Link the repository to Vercel and set the production branch to `main`.
- **Framework**: Next.js with the Node.js 18 runtime.
- **Build & Output Settings**: Enable "Output Directory" as `.vercel/output` and use default `next build` output.

### Environment Variables
- Manage secrets through Vercel's Environment Variables UI or via `vercel env` CLI.
- Define variables for each environment (`Development`, `Preview`, `Production`).
- Typical variables:
  - `NEYNAR_API_KEY` – Farcaster API access.
  - `PINATA_JWT` – IPFS uploads.
  - `CRON_SECRET` – protects scheduled publish endpoint.
  - `NEXT_PUBLIC_BASE_URL` – base URL for client-side calls.
- Avoid committing secrets; rely on Vercel's encrypted storage.

### Build Commands
- Install dependencies with `npm ci`.
- Build the app with `npm run build`.
- Production start command: `npm start` (served by Vercel's serverless environment).

## CI/CD Pipeline
1. **Commit & Push** – developers push to feature branches.
2. **Pre-Deployment Validation** – GitHub Actions run `npm run lint`, `npm test`, and `npm run typecheck`.
3. **Preview Deployment** – successful validations trigger Vercel to build and deploy a Preview environment.
4. **Merge to Main** – merging to `main` triggers the Production build on Vercel.
5. **Smoke Tests** – after deployment, run automated checks against `/api/health`.

## Rollback Procedure
- Use `vercel rollback <deployment-id>` to revert to a previous deployment.
- Alternatively, revert the problematic commit and push to trigger a fresh deployment.

## Monitoring Hooks
- Enable Vercel Analytics and log streaming for runtime visibility.
- Integrate a health-check endpoint with an uptime monitor (e.g., Pingdom or cron-based pings).
- Configure deployment webhooks to notify Slack on success or failure.
- Use an error tracking service like Sentry for client and server runtime exceptions.
