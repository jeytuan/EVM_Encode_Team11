// CastVote.ts
import { viem } from "hardhat";
import { getContract } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "<your_contract_address_here>";

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
    walletClient,
  });

  const txHash = await ballot.write.vote([0]);
  console.log(`\u2705 Vote cast for proposal 0. Tx hash: ${txHash}`);
}

main().catch((err) => {
  console.error("\u274C Cast vote script failed:", err);
  process.exit(1);
});

