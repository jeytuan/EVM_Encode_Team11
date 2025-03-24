// DeployBallot.ts
import { viem } from "hardhat";
import { stringToBytes } from "viem";
import BallotArtifact from "../artifacts/contracts/Ballot.sol/Ballot.json";

const PROPOSALS = ["Chocolate", "Vanilla", "Strawberry"];

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();
  const account = walletClient.account;

  const proposalsBytes = PROPOSALS.map(name => stringToBytes(name));

  const hash = await walletClient.deployContract({
    abi: BallotArtifact.abi,
    bytecode: BallotArtifact.bytecode as `0x${string}`,
    args: [proposalsBytes],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`\u2705 Ballot deployed at: ${receipt.contractAddress}`);
}

main().catch((err) => {
  console.error("\u274C Ballot deployment failed:", err);
  process.exit(1);
});

