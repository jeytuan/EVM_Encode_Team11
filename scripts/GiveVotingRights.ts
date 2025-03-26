// scripts/GiveVotingRights.ts

import { viem } from "hardhat";
import { getContract, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// ✅ Replace with actual deployed TokenizedBallot address and target wallet
const TOKENIZED_BALLOT_ADDRESS = "0x15d54584363d820958db0acf5b1054a9baa39cac";
const TARGET_ADDRESS = "0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7";

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

  const txHash = await ballot.write.giveRightToVote([TARGET_ADDRESS], {
    account,
  });

  console.log(`✅ Voting rights granted to ${TARGET_ADDRESS}`);
  console.log(`📜 Tx hash: ${txHash}`);
}

main().catch((err) => {
  console.error("❌ Failed to grant voting rights:", err);
  process.exit(1);
});
