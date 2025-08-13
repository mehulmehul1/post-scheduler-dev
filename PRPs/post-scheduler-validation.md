# Post Scheduler Validation Plan

## Linting

### ESLint
- **Command:** `npx eslint "**/*.{js,ts,tsx}"`
- **Success Criteria:** Completes with no errors or warnings.

### Prettier
- **Command:** `npx prettier --check .`
- **Success Criteria:** Reports `All matched files use Prettier code style!`.

## Tests

### Unit Tests
- **Command:** `npm run test:unit`
- **Sample Passing Output:**
  ```
  PASS src/utils/__tests__/scheduler.test.ts
    ✓ schedules posts at future times (15 ms)

  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total
  ```

### Integration Tests
- **Command:** `npm run test:integration`
- **Sample Passing Output:**
  ```
  PASS test/scheduler.integration.test.ts
    ✓ posts are published at scheduled time (68 ms)

  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total
  ```

## Manual Verification

### Farcaster Embed
1. Build and start the app: `npm run build && npm start`.
2. Open `http://localhost:3000` and compose a cast with an image and schedule time.
3. Copy the generated Farcaster embed URL and open it in Warpcast or Base App.
4. Verify the embed renders correctly and the scheduled cast appears at the specified time.

### Base Chain Interactions
1. Connect a wallet configured for Base.
2. Ensure the scheduling contract is deployed and the app is configured with its address.
3. Trigger a scheduling action that requires an on-chain transaction.
4. Sign and submit the transaction; confirm it on a Base block explorer.
5. Verify the application recognizes the confirmed transaction and scheduled post.
