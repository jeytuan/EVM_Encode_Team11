import { viem } from "hardhat";
import { getContract } from "viem";
import { bytesToString } from "viem/utils";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0xac1b5f1a9c62280dd46fb92e0514c8017d64d30d";

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
  });

  const count = await ballot.read.getProposalsCount();

  console.log(`📊 Proposals and Votes (${count} total):\n`);
  for (let i = 0; i < Number(count); i++) {
    const name = await ballot.read.getProposalName([i]);
    const votes = await ballot.read.getProposalVotes([i]);
    console.log(`📌 Proposal ${i}: ${bytesToString(name as Uint8Array)} — ${votes} votes`);
  }
}

main().catch((err) => {
  console.error("❌ Error querying results:", err);
  process.exit(1);
});
