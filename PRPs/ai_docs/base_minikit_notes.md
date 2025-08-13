# Base Minikit Notes

## Chain IDs
- Base Mainnet: 8453
- Base Sepolia Testnet: 84532

## viem wallet connection snippets

```ts
import { createWalletClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// mainnet connection
const clientMainnet = createWalletClient({
  chain: base,
  transport: http(),
});

// sepolia testnet connection
const clientSepolia = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});
```

## Base App embedding quirks and best practices
- When embedding the Base App in an iframe, include `allow="clipboard-write"` so users can copy addresses.
- Use a unique `nonce` with CSP headers when injecting scripts to satisfy security policies.
- Handle `postMessage` events and verify `event.origin` is the expected Base domain before acting.
- For internal navigation inside an embed, set links to `target="_parent"` to avoid nested frames.
