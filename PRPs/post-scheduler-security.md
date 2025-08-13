# Post Scheduler Security

## Potential Vulnerabilities
- **Delegated signer misuse**: compromised delegate key posting unauthorized casts.
- **IPFS upload abuse**: users flooding storage with large or malicious files.
- **Cron endpoint abuse**: attackers triggering publish routes or flooding schedule APIs.
- **Secrets exposure**: accidental commit or logging of sensitive tokens.
- **Denial-of-service**: oversized payloads or rapid-fire requests overwhelming the service.

## Mitigation Strategies
- Limit delegated signer scopes; rotate delegation keys and audit usage.
- Enforce file size/MIME checks before IPFS upload and pin only whitelisted types.
- Protect cron endpoints with `CRON_SECRET` and server-only routing; validate inputs strictly.
- Store secrets in environment variables; never log token values; use separate dev/prod credentials.
- Apply request body limits and validation; monitor for anomalous spikes and employ circuit breakers.

## Required Secrets Handling
- `NEYNAR_API_KEY` for Farcaster interactions.
- `PINATA_JWT` for IPFS pinning.
- `CRON_SECRET` for scheduled publish endpoint.
- `DELEGATED_SIGNER` or equivalent delegation token.
- Maintain secrets in a secure manager (e.g., Vercel/Env vars); rotate regularly and restrict access.

## Rate-Limiting Strategies
- Per-FID and per-IP rate limits on `/api/schedule` and upload endpoints.
- Burst limits with token buckets plus global caps to prevent abuse.
- Exponential backoff and retries for third-party APIs (IPFS, Neynar) to avoid hammering services.

## Periodic Security Review Checklist
- [ ] Rotate delegated signer and API keys; revoke unused credentials.
- [ ] Review access logs and rate-limit metrics for anomalies.
- [ ] Run dependency audits (`npm audit`/`pip audit`) and patch CVEs.
- [ ] Confirm secrets are absent from commits and logs.
- [ ] Verify cron endpoints require `CRON_SECRET` and respond only over HTTPS.
- [ ] Validate rate limits and request size caps match expected traffic.
