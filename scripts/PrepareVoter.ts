// scripts/PrepareVoter.ts
import { viem } from "hardhat";
import {
  createWalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import MyTokenArtifact from "../artifacts/contracts/MyToken.sol/MyToken.json";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
const BALLOT_ADDRESS = "0x945b8bef68348aae5ca907913c00ea89377f2323";

// 🎯 Voter address (Wallet 2)
const VOTER_ADDRESS = "0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7";

// 🎯 Voter address (Wallet 3)
// const VOTER_ADDRESS = "0x6ccF09a6bA32713b93f27d0B4AAB781Daf98a7Ad";

const VOTE_AMOUNT = 1n * 10n ** 18n;

async function main() {
  const deployer = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
  console.log("🔐 Deployer:", deployer.address);
  console.log("🎯 Preparing:", VOTER_ADDRESS);

  const walletClient = createWalletClient({
    account: deployer,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const token = getContract({
    address: TOKEN_ADDRESS,
    abi: MyTokenArtifact.abi,
    client: walletClient,
  });

  const ballot = getContract({
    address: BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: walletClient,
  });

  // ✅ 1. Mint tokens to voter
  const mintTx = await token.write.mint([VOTER_ADDRESS, VOTE_AMOUNT], { account: deployer });
  console.log(`✅ Minted tokens. Tx: ${mintTx}`);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });

  // ✅ 2. Delegate votes to voter
  const delegateTx = await token.write.delegate([VOTER_ADDRESS], { account: deployer });
  console.log(`🗳️ Delegated votes. Tx: ${delegateTx}`);
  await publicClient.waitForTransactionReceipt({ hash: delegateTx });

  // ⏳ Wait a block to ensure checkpoint is saved
  console.log("⏳ Waiting 1 block to register delegation...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // ✅ 3. Grant voting rights
  const giveRightTx = await ballot.write.giveRightToVote([VOTER_ADDRESS], { account: deployer });
  console.log(`🎟️ Voting rights granted. Tx: ${giveRightTx}`);
}

main().catch(err => {
  console.error("❌ Failed to prepare voter:", err);
  process.exit(1);
});
