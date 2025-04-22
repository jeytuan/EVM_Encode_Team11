import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying PoolFactory from:", deployer.address);

  const Factory = await ethers.getContractFactory("PoolFactory");

  // Deploy the PoolFactory with no constructor args
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  console.log("✅ PoolFactory deployed to:", factory.target);

  // Write address to frontend shared file
  const addressesPath = path.resolve(__dirname, "../../my-dapp-ui/packages/nextjs/contracts/deployedAddresses.json");
  const addressMap = {
    poolFactory: factory.target.toString(), // cast to string if needed
  };
  writeFileSync(addressesPath, JSON.stringify(addressMap, null, 2));

  console.log("📦 Synced deployed address to deployedAddresses.json");
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
