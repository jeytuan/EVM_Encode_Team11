// scripts/MintTokens.ts
import { viem } from "hardhat";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { createWalletClient, http } from "viem";
import { getContract } from "viem";
import MyTokenArtifact from "../artifacts/contracts/MyToken.sol/MyToken.json";

const MYTOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
// const RECIPIENT = "0xbbbFA6De552944997FEB5a2d5a382fE11eADDD3A"; // Your account
const RECIPIENT = "0xbbc48f914D62bc24cF686E6Ef64f9BBac24bdbD4";
const AMOUNT = 1n * 10n ** 18n; // 1 token

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("❌ PRIVATE_KEY not set");

  const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const myToken = getContract({
    address: MYTOKEN_ADDRESS,
    abi: MyTokenArtifact.abi,
    client,
  });

  const txHash = await myToken.write.mint([RECIPIENT, AMOUNT], { account });
  console.log(`✅ Minted ${AMOUNT} tokens to ${RECIPIENT}`);
  console.log(`📜 Tx hash: ${txHash}`);
}

main().catch((err) => {
  console.error("❌ Minting failed:", err);
  process.exit(1);
});
