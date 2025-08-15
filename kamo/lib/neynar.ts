const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/cast';

export type PostCastInput = {
  text: string;
  imageUrl?: string;
};

export async function postCast(input: PostCastInput): Promise<any> {
  const apiKey = process.env.NEYNAR_API_KEY;
  const signerUuid = process.env.NEYNAR_SIGNER_UUID;

  if (!apiKey) throw new Error('Missing NEYNAR_API_KEY');
  if (!signerUuid) throw new Error('Missing NEYNAR_SIGNER_UUID');

  let text = input.text ?? '';
  if (input.imageUrl) {
    // Conservative: append the image URL to text so clients can render it.
    if (!text.includes(input.imageUrl)) {
      text = `${text} ${input.imageUrl}`.trim();
    }
  }

  const payload = {
    signer_uuid: signerUuid,
    text,
  } as const;

  const res = await fetch(NEYNAR_API_URL, {
    method: 'POST',
    headers: {
      'api_key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // no-op; some errors may not return JSON
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(`Neynar cast failed: ${msg}`);
  }

  return data;
}
