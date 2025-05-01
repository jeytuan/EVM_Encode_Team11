// drypto/nft-generator/utils/uploadToNFTStorage.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config();

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY!;
if (!NFT_STORAGE_API_KEY) throw new Error('❌ Missing NFT_STORAGE_API_KEY in .env');

async function uploadImage(filePath: string) {
  try {
    const imageData = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    const form = new FormData();
    form.append('file', imageData, fileName);

    const response = await axios.post('https://api.nft.storage/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${NFT_STORAGE_API_KEY}`,
      },
    });

    const cid = response.data.value.cid;
    console.log(`✅ Uploaded to NFT.Storage! CID: ${cid}`);
    console.log(`🔗 IPFS URL: https://ipfs.io/ipfs/${cid}`);
    return cid;
  } catch (err) {
    console.error('🔥 Upload failed:', err);
  }
}

if (require.main === module) {
  const imagePath = path.resolve(
    __dirname,
    '../assets/traits/elemental_effects/woodpecker/Fire_Woodpecker.png'
  );
  console.log(`📤 Uploading Fire_Woodpecker.png to NFT.Storage...`);
  uploadImage(imagePath);
}
