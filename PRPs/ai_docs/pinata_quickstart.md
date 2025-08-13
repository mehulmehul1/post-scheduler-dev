# Pinata Quickstart

This guide shows how to upload content to [Pinata](https://www.pinata.cloud/) using a JSON Web Token (JWT).

## 1. Create a JWT
1. Log in to your Pinata account and open the **API Keys** page.
2. Create a new API key with the required permissions (usually `pinFileToIPFS` or PSA upload).
3. After creation, Pinata will show the **API Key** and **API Secret**.
4. Create a JWT by Base64‑encoding `apiKey:apiSecret` and passing it to your application. Example in Node.js:

```js
import jwt from 'jsonwebtoken';

const jwtToken = jwt.sign({}, '<API Secret>', {
  subject: '<API Key>',
  expiresIn: '1h'
});

// Use jwtToken as the Authorization header
```

Alternatively, you can generate the token using any JWT tool or Pinata's dashboard.

## 2. Upload a file/blob
Example using `fetch` in Node.js to upload a file buffer:

```js
import fs from 'node:fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const token = process.env.PINATA_JWT;
const data = new FormData();
data.append('file', fs.createReadStream('logo.png'));

const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: data
});

const json = await res.json();
console.log(json);
```

The same API accepts a raw `Blob` when running in the browser.

## 3. Response and CID
Successful uploads return a JSON object containing the content identifier (CID):

```json
{
  "IpfsHash": "bafy...",
  "PinSize": 12345,
  "Timestamp": "2024-01-01T12:00:00Z"
}
```

- `IpfsHash` – the CID you can use to access the content.
- `PinSize` – size of the pinned data in bytes.
- `Timestamp` – ISO timestamp when the content was pinned.

Access the content through any IPFS gateway, for example:

```
https://gateway.pinata.cloud/ipfs/<CID>
```

## 4. Limits and public access
- Pinata's public gateway accepts uploads up to **100 MB** per request. Larger files require chunking or a different plan.
- Uploaded content is public on the IPFS network. Do **not** store secrets or private data unless you use a private gateway or encryption.
- To remain available, the CID must be pinned by at least one node (Pinata pins it while your subscription is active).

## 5. Next steps
- Explore Pinata's [Pin Policy](https://docs.pinata.cloud) for advanced options.
- Use the CID in your application for distributed, content-addressed storage.
