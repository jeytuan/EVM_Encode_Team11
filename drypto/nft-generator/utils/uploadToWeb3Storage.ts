import { Web3Storage, File } from 'web3.storage';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.WEB3_STORAGE_API_KEY!;
if (!token) throw new Error('❌ Missing WEB3_STORAGE_API_KEY in .env');

const client = new Web3Storage({ token });

async function uploadFile(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const fileName = path.basename(filePath);
  const files = [new File([content], fileName, { type: 'application/json' })];
  const cid = await client.put(files);
  console.log(`✅ Uploaded metadata to IPFS: ipfs://${cid}/${fileName}`);
}

if (require.main === module) {
  const metadataPath = path.resolve(__dirname, '../metadata/Fire_Woodpecker.json');
  uploadFile(metadataPath).catch(console.error);
}
