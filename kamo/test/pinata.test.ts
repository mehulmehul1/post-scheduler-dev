import { uploadImage  from '../lib/pinata';
import { describe, it, expect, vi  from 'vitest';

vi.stubEnv('PINATA_JWT', 'test-jwt');

describe('Pinata Upload', () => {
  it('successfully uploads valid image', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({ IpfsHash: 'QmTest' }), { status: 200 ));

    const result = await uploadImage(mockFile);
    expect(result).toBe('ipfs://QmTest');
    expect(fetch).toHaveBeenCalled();
  });

  it('handles invalid file type', async () => {
    const mockFile = new File(['text'], 'test.txt', { type: 'text/plain' });
    await expect(uploadImage(mockFile)).rejects.toThrow('Image upload failed');
  });
});