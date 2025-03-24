// DelegateVotes.ts
import { viem } from "hardhat";
import { getContract } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "<your_contract_address_here>";
const DELEGATE_TO = "<delegate_wallet_address_here>";

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    publicClient,
    walletClient,
  });

  const txHash = await ballot.write.delegate([DELEGATE_TO]);
  console.log(`\u2705 Vote delegated to ${DELEGATE_TO}. Tx hash: ${txHash}`);
}

main().catch((err) => {
  console.error("\u274C Delegation failed:", err);
  process.exit(1);
});

