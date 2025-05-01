import { ethers } from "hardhat";
import { writeFileSync, existsSync, readFileSync } from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const CHAIRPERSON_KEY = process.env.PRIVATE_KEY_CHAIRPERSON;
  if (!CHAIRPERSON_KEY) throw new Error("Missing PRIVATE_KEY_CHAIRPERSON in .env");

  // Use Hardhat-injected provider from runtime
  const provider = ethers.provider;
  const signer = new ethers.Wallet(CHAIRPERSON_KEY, provider);

  console.log("🚀 Deploying PoolFactory from:", await signer.getAddress());

  const Factory = await ethers.getContractFactory("PoolFactory", signer);
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  console.log("✅ PoolFactory deployed to:", factory.target);

  // Save address to deployedAddresses.json
  const addressesPath = path.resolve(__dirname, "../../my-dapp-ui/packages/nextjs/contracts/deployedAddresses.json");
  let deployedAddresses: Record<string, any> = {};

  if (existsSync(addressesPath)) {
    deployedAddresses = JSON.parse(readFileSync(addressesPath, "utf-8"));
  }

  const chainId = (await provider.getNetwork()).chainId.toString();
  deployedAddresses[chainId] = {
    ...deployedAddresses[chainId],
    poolFactory: factory.target.toString(),
  };

  writeFileSync(addressesPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("📦 Synced deployedAddresses.json for chainId:", chainId);
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
