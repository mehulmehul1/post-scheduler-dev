import { PinataFDK, PinataConfig  from 'pinata/sdk';

const config: PinataConfig = {
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: 'https://gateway.pinata.cloud',
};

const pinata = new PinataFDK(config);

export const uploadImage = async (file: File | Blob): Promise<string> => {
  try {
    const upload = await pinata.upload.file(file);
    if (upload.IpfsHash) {
      return `ipfs://${upload.IpfsHash}`;
    }
    throw new Error('Failed to get IPFS hash');
   catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error('Image upload failed - check PINATA_JWT permissions');
  }
};