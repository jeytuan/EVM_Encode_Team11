import { viem } from "hardhat";
import { getContract } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// Replace this with the actual contract address
const TOKENIZED_BALLOT_ADDRESS = "0xYourBallotContractAddress";
const TARGET_ADDRESS = "0xWalletToGrantVotingRights";

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
    walletClient,
  });

  const hash = await ballot.write.giveRightToVote([TARGET_ADDRESS]);
  console.log(`✅ Voting rights granted to ${TARGET_ADDRESS}`);
  console.log(`📜 Tx hash: ${hash}`);
}

main().catch((err) => {
  console.error("❌ Failed to grant voting rights:", err);
  process.exit(1);
});
