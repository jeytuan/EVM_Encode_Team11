import { viem } from "hardhat";
import { parseAbi } from "viem";
import { tokenizedBallotAbi } from "../typechain-types/TokenizedBallot"; // adjust if ABI is custom

const MYTOKEN_ADDRESS = "0x5b0f95c3e87c088cecb02aac064c899cbef95efa97710d6ca98e3794d925e4d4"; // replace with actual deployed token
const PROPOSALS = ["Chocolate", "Vanilla", "Strawberry"];
const VOTE_TOKEN_DECIMALS = 18;

async function main() {
  const walletClient = await viem.getWalletClient();
  const publicClient = await viem.getPublicClient();
  const account = walletClient.account;

  const proposalBytes = PROPOSALS.map((name) =>
    viem.utils.encodeBytes32String(name)
  );

  // Deploy TokenizedBallot
  const deployHash = await walletClient.deployContract({
    abi: tokenizedBallotAbi,
    bytecode: "0x...", // <- Insert your compiled bytecode or use viem plugin to generate
    args: [proposalBytes, MYTOKEN_ADDRESS],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: deployHash,
  });

  console.log(`✅ TokenizedBallot deployed at: ${receipt.contractAddress}`);
  console.log(`Proposals: ${PROPOSALS.join(", ")}`);
}

main().catch((err) => {
  console.error("❌ Error deploying TokenizedBallot:", err);
  process.exit(1);
});
