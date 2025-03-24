import { viem } from "hardhat";
import { encodeBytes32String } from "viem";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const MYTOKEN_ADDRESS = "0xYourTokenAddressHere";
const PROPOSALS = ["Chocolate", "Vanilla", "Strawberry"];

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();
  const account = walletClient.account;

  const proposalBytes = PROPOSALS.map((name) => encodeBytes32String(name));

  const deployHash = await walletClient.deployContract({
    abi: TokenizedBallotArtifact.abi,
    bytecode: TokenizedBallotArtifact.bytecode as `0x${string}`,
    args: [proposalBytes, MYTOKEN_ADDRESS],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });

  console.log(`✅ TokenizedBallot deployed at: ${receipt.contractAddress}`);
  console.log(`🗳️ Proposals: ${PROPOSALS.join(", ")}`);
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
