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

// ✅ Replace with your deployed token address
const MYTOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not set in .env file.");
  }

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  const DELEGATE_TO = account.address;

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

  console.log(`🔐 Loaded wallet: ${account.address}`);
  console.log(`🗳️ Delegating votes to: ${DELEGATE_TO}`);

  const txHash = await token.write.delegate([DELEGATE_TO], {
    account,
  });

  console.log(`✅ Delegation successful. Tx hash: ${txHash}`);

  // Optional: Check voting power of delegatee
  try {
    const readToken = getContract({
      address: MYTOKEN_ADDRESS,
      abi: MyTokenArtifact.abi,
      client: publicClient,
    });

    const updatedVotes = await readToken.read.getVotes([DELEGATE_TO]);
    console.log(`📊 ${DELEGATE_TO} voting power: ${updatedVotes}`);
  } catch (err) {
    console.warn("⚠️ Could not fetch voting power (may need block confirmation).");
  }
}

main().catch((err) => {
  console.error("❌ Delegation failed:", err);
  process.exit(1);
});
