import { viem } from "hardhat";
import { getContract, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

// const TOKENIZED_BALLOT_ADDRESS = "0x15d54584363d820958db0acf5b1054a9baa39cac";
const TOKENIZED_BALLOT_ADDRESS = "0x945b8bef68348aae5ca907913c00ea89377f2323";

// ✅ Add all voter addresses here
const TARGET_ADDRESSES = [
  "0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7",
  "0xbbc48f914D62bc24cF686E6Ef64f9BBac24bdbD4", // MetaMask wallet
];

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

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: walletClient,
  });

  for (const address of TARGET_ADDRESSES) {
    try {
      const txHash = await ballot.write.giveRightToVote([address], { account });
      console.log(`✅ Voting rights granted to ${address}`);
      console.log(`📜 Tx hash: ${txHash}\n`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ Failed to grant rights to ${address}:`, message);
    }
  }
}

main().catch((err) => {
  console.error("❌ Failed in script execution:", err);
  process.exit(1);
});
