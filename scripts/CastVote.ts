// scripts/CastVote.ts

import { viem } from "hardhat";
import {
  getContract,
  createWalletClient,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// 🔧 Replace with your actual deployed contract address
// const TOKENIZED_BALLOT_ADDRESS = "0xac1b5f1a9c62280dd46fb92e0514c8017d64d30d";
const TOKENIZED_BALLOT_ADDRESS = "0x15d54584363d820958db0acf5b1054a9baa39cac";
// const TOKENIZED_BALLOT_ADDRESS = "0xbbc48f914D62bc24cF686E6Ef64f9BBac24bdbD4";

  

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

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: walletClient,
  });

  // ✅ Pass 2 arguments: proposal index and voting power (adjust as needed)
  const txHash = await ballot.write.vote([0n, 1n], {
    account,
  });

  console.log(`🟩 Vote cast for proposal 0 with 1 vote. Tx hash: ${txHash}`);
  console.log("📮 Voting from address:", account.address);

}

main().catch((err) => {
  console.error("❌ Cast vote script failed:", err);
  process.exit(1);
});
