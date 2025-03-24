// deployMyToken.ts
import { viem } from "hardhat";
import MyTokenArtifact from "../artifacts/contracts/MyToken.sol/MyToken.json";

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();
  const account = walletClient.account;

  const hash = await walletClient.deployContract({
    abi: MyTokenArtifact.abi,
    bytecode: MyTokenArtifact.bytecode as `0x${string}`,
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`\u2705 MyToken deployed at: ${receipt.contractAddress}`);
}

main().catch((err) => {
  console.error("\u274C Token deployment failed:", err);
  process.exit(1);
});