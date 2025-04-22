// scripts/CastVote.ts
import { viem } from "hardhat";
import {
  getContract,
  createWalletClient,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const BALLOT_ADDRESS = "0x945b8bef68348aae5ca907913c00ea89377f2323";
const PROPOSAL_INDEX = 2n; // 🥭 Strawberry
const VOTE_AMOUNT = 1n;

async function main() {
  const voterKey = process.env.VOTER2_PRIVATE_KEY;
  if (!voterKey) throw new Error("❌ VOTER2_PRIVATE_KEY not set in .env");

  const account = privateKeyToAccount(`0x${voterKey}`);
  console.log("🔐 Voting with wallet:", account.address);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const ballot = getContract({
    address: BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: walletClient,
  });

  // Check vote power spent
  const spent = await ballot.read.votePowerSpent([account.address]);
  console.log(`💥 Vote power already spent: ${spent}`);

  // Cast vote!
  const txHash = await ballot.write.vote([PROPOSAL_INDEX, VOTE_AMOUNT], { account });
  console.log(`🟩 Vote cast for proposal ${PROPOSAL_INDEX} with ${VOTE_AMOUNT} vote`);
  console.log(`📮 Tx hash: ${txHash}`);
}

main().catch(err => {
  console.error("❌ Cast vote script failed:", err);
  process.exit(1);
});
