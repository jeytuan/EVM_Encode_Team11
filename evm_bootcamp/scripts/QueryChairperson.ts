import { viem } from "hardhat";
import { getContract } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0xYourBallotContractAddress";

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
  });

  const chair = await ballot.read.chairperson();
  console.log(`👤 Chairperson Address: ${chair}`);
}

main().catch((err) => {
  console.error("❌ Error querying chairperson:", err);
  process.exit(1);
});
