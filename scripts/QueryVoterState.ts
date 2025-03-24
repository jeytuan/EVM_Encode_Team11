import { viem } from "hardhat";
import { getContract } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0xYourBallotContractAddress";
const VOTER_ADDRESS = "0xVoterToInspect";

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
  });

  const voter = await ballot.read.voters([VOTER_ADDRESS]);

  console.log("🔍 Voter Data:");
  console.log("Weight   :", voter[0]);
  console.log("Voted    :", voter[1]);
  console.log("Delegate :", voter[2]);
  console.log("Vote     :", voter[3]);
}

main().catch((err) => {
  console.error("❌ Error querying voter:", err);
  process.exit(1);
});
