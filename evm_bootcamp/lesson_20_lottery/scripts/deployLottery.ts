import { viem } from "hardhat";
import { parseEther } from "viem";
import fs from "fs";
import path from "path";

async function main() {
  const TOKEN_NAME = "LotteryToken";
  const TOKEN_SYMBOL = "LT0";
  const TOKEN_RATIO = 1n;
  const BET_PRICE = parseEther("1"); // 1 LT0 per bet
  const BET_FEE = parseEther("0.2"); // 0.2 LT0 per fee

  const accounts = await viem.getWalletClients();
  const deployer = accounts[0];

  console.log(`🚀 Deploying Lottery from: ${deployer.account.address}`);

  const contract = await viem.deployContract("Lottery", [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_RATIO,
    BET_PRICE,
    BET_FEE,
  ]);

  const tokenAddress = (await contract.read.paymentToken()) as `0x${string}`;

  console.log(`🎲 Lottery deployed at: ${contract.address}`);
  console.log(`💰 Token deployed at: ${tokenAddress}`);

  saveAddresses(contract.address, tokenAddress, "sepolia");
}

function saveAddresses(
  lottery: string,
  token: string,
  network: string
): void {
  const filePath = path.join(__dirname, "../deployedAddresses.json");

  let existing: Record<string, any> = {};
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  const updated = {
    ...existing,
    [network]: {
      lottery,
      token,
    },
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  console.log(`📦 Saved contract addresses to ${filePath}`);
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
