import { viem } from "hardhat";
import { getContract, bytesToString } from "viem/utils";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0xYourBallotContractAddress";

async function main() {
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
  });

  const winnerIndex = await ballot.read.winningProposal();
  const winnerNameBytes = await ballot.read.winnerName();
  const winnerName = bytesToString(winnerNameBytes as Uint8Array);

  console.log(`🥇 Winning Proposal Index: ${winnerIndex}`);
  console.log(`🏆 Winner Name: ${winnerName}`);
}

main().catch((err) => {
  console.error("❌ Error reading from ballot:", err);
  process.exit(1);
});
