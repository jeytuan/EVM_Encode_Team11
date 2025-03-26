// scripts/DelegateVotes.ts

import { viem } from "hardhat";
import {
  getContract,
  createWalletClient,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import MyTokenArtifact from "../artifacts/contracts/MyToken.sol/MyToken.json";

// ✅ Replace with your actual MyToken contract address and delegatee
const MYTOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
const DELEGATE_TO = "0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not set in .env file.");
  }

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = await viem.getPublicClient();

  const token = getContract({
    address: MYTOKEN_ADDRESS,
    abi: MyTokenArtifact.abi,
    client: walletClient,
  });

  // ✅ Delegate votes to target address
  const txHash = await token.write.delegate([DELEGATE_TO], {
    account,
  });

  console.log(`🟩 Vote delegated to ${DELEGATE_TO}. Tx hash: ${txHash}`);

  // Optional: Read new votes — wrap in try/catch to avoid crashing if checkpoints are still unavailable
  try {
    const readToken = getContract({
      address: MYTOKEN_ADDRESS,
      abi: MyTokenArtifact.abi,
      client: publicClient,
    });

    const updatedVotes = await readToken.read.getVotes([account.address]);
    console.log(`🗳️ Updated voting power: ${updatedVotes}`);
  } catch (err) {
    console.warn("⚠️ Could not read voting power after delegation (possibly no checkpoints yet).");
  }
}

main().catch((err) => {
  console.error("❌ Delegation failed:", err);
  process.exit(1);
});
