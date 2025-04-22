// scripts/deployMyToken.ts

import { viem } from "hardhat";
import MyTokenArtifact from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as fs from "fs";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not set in .env file.");
  }

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = await viem.getPublicClient();

  const hash = await walletClient.deployContract({
    abi: MyTokenArtifact.abi,
    bytecode: MyTokenArtifact.bytecode as `0x${string}`,
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`✅ MyToken deployed at: ${receipt.contractAddress}`);

  // Optional: Save deployed address to JSON
  const addressesPath = "./deployedAddresses.json";
  const deployed = fs.existsSync(addressesPath)
    ? JSON.parse(fs.readFileSync(addressesPath, "utf8"))
    : {};

  deployed["sepolia"] = {
    ...(deployed["sepolia"] || {}),
    MyToken: receipt.contractAddress,
  };

  fs.writeFileSync(addressesPath, JSON.stringify(deployed, null, 2));
}

main().catch((err) => {
  console.error("❌ Token deployment failed:", err);
  process.exit(1);
});
