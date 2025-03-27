import { createPublicClient, getContract, http } from "viem";
import { sepolia } from "viem/chains";
import { bytesToString, hexToBytes } from "viem/utils";
import TokenizedBallotArtifact from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const TOKENIZED_BALLOT_ADDRESS = "0x15d54584363d820958db0acf5b1054a9baa39cac";

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const ballot = getContract({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallotArtifact.abi,
    client: publicClient,
  });

  const count = await ballot.read.getProposalsCount();

  console.log(`📊 Proposals and Votes (${count} total):\n`);
  for (let i = 0; i < Number(count); i++) {
    const name = (await ballot.read.getProposalName([BigInt(i)])) as `0x${string}`;
    const votes = await ballot.read.getProposalVotes([BigInt(i)]);
    console.log(`📌 Proposal ${i}: ${bytesToString(hexToBytes(name))} - ${votes} votes`);
  }
}

main().catch((err) => {
  console.error("❌ Error querying results:", err);
  process.exit(1);
});
