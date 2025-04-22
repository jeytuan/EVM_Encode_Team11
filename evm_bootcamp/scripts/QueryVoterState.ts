// scripts/QueryVoterState.ts

import { viem } from "hardhat";
import { getContract } from "viem";
import { sepolia } from "viem/chains";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// ✅ Replace with actual deployed TokenizedBallot address and target wallet
const TOKENIZED_BALLOT_ADDRESS = "0xac1b5f1a9c62280dd46fb92e0514c8017d64d30d";
const VOTER_ADDRESS = "0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7";

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: publicClient,
  });

  const [weight, voted, delegate, vote] =
    await ballot.read.voters([VOTER_ADDRESS]) as readonly [bigint, boolean, `0x${string}`, bigint];

  console.log("🧠 Voter Data:");
  console.log("Weight   :", weight.toString());
  console.log("Voted    :", voted);
  console.log("Delegate :", delegate);
  console.log("Vote     :", vote.toString());
}

main().catch((err) => {
  console.error("❌ Error querying voter:", err);
  process.exit(1);
});
