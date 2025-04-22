// scripts/deployTokenizedBallot.ts

import { viem } from "hardhat";
import { sepolia } from "viem/chains";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const MYTOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
const PROPOSALS = ["Chocolate", "Vanilla", "Strawberry"];

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not set in .env");
  }

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const proposalBytes = PROPOSALS.map(name =>
    `0x${Buffer.from(name, "utf8").toString("hex").padEnd(64, "0")}` as const
  );

  console.log(`📦 Deploying TokenizedBallot (no snapshot block param)`);

  const deployHash = await walletClient.deployContract({
    abi: TokenizedBallotArtifact.abi,
    bytecode: TokenizedBallotArtifact.bytecode as `0x${string}`,
    args: [proposalBytes, MYTOKEN_ADDRESS], // ✅ ONLY 2 args
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
