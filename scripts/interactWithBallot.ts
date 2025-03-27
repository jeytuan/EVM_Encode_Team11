import { viem } from "hardhat";
import { getContract, bytesToString } from "viem";
import { sepolia } from "viem/chains";
import { http, createPublicClient } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0x15d54584363d820958db0acf5b1054a9baa39cac";

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: publicClient,
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
