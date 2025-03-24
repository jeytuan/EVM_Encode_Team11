import { viem } from "hardhat";
import { getContract, Address, PublicClient } from "viem";
import { bytesToString } from "viem/utils";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// Constants
const TOKENIZED_BALLOT_ADDRESS = "0x5b0f95c3e87c088cecb02aac064c899cbef95efa97710d6ca98e3794d925e4d4" as Address;
const TOKENIZED_BALLOT_ABI = TokenizedBallotArtifact.abi;

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TOKENIZED_BALLOT_ABI,
    client: publicClient, // ✅ correct key here
  });

  const proposalCount = await ballot.read.getProposalsCount();
  console.log(`🗳 Total Proposals: ${proposalCount}\n`);

  for (let i = 0; i < Number(proposalCount); i++) {
    const name = await ballot.read.getProposalName([i]);
    const votes = await ballot.read.getProposalVotes([i]);
    console.log(`📌 Proposal ${i}: ${bytesToString(name as Uint8Array)} — ${votes} votes`);
}
}

main().catch((err) => {
  console.error("❌ Error reading ballot:", err);
  process.exit(1);
});
