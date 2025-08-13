# Neynar Cast API

Documentation for posting casts using Neynar's v2 Farcaster API.

## Endpoint

`POST https://api.neynar.com/v2/farcaster/cast`

## Required Headers

| Header | Value |
| ------ | ----- |
| `api_key` | Your Neynar API key |
| `Content-Type` | `application/json` |

## Sample Requests

### Basic Cast

```bash
curl -X POST https://api.neynar.com/v2/farcaster/cast \
  -H "api_key: $NEYNAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "signer_uuid": "abcd-1234",
        "text": "Hello Farcaster!"
      }'
```

### Reply Cast

```bash
curl -X POST https://api.neynar.com/v2/farcaster/cast \
  -H "api_key: $NEYNAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "signer_uuid": "abcd-1234",
        "text": "Reply example",
        "parent": { "fid": 12345, "hash": "0xabcdef..." }
      }'
```

### Quote Cast

```bash
curl -X POST https://api.neynar.com/v2/farcaster/cast \
  -H "api_key: $NEYNAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "signer_uuid": "abcd-1234",
        "text": "Quoting a cast",
        "quote": "0xdeadbeef..."
      }'
```

## Rate Limits

Neynar enforces per‑API‑key rate limits. Free plans typically allow around 60 cast creations per minute and 1,000 per day. When you exceed the limit the API returns `429 Too Many Requests` and includes a `Retry-After` header indicating when you can try again.

## Error Responses

| Status | Cause | Notes |
| ------ | ----- | ----- |
| `400 Bad Request` | Invalid payload, missing fields | Verify `signer_uuid` and `text`. |
| `401 Unauthorized` | Missing or incorrect `api_key` | Ensure your API key is active. |
| `404 Not Found` | Parent/quote cast not found | Check hash and fid values. |
| `429 Too Many Requests` | Rate limit exceeded | Wait and retry after delay. |
| `500 Internal Server Error` | Server‑side issue | Retry or contact support if persistent. |
