import { createPublicClient, getAddress, http } from "viem";
import { sepolia } from "viem/chains";
import { formatEther } from "viem/utils";

const RAW_ADDRESS = "0xBbC48f914D62bc24cF6866Ef64f9Bbac24bdbDD4"; // <- FIXED

const address = getAddress(RAW_ADDRESS); // Validated + checksummed

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia.publicnode.com"),
});

async function main() {
  const balance = await client.getBalance({ address });
  console.log("✅ Balance:", formatEther(balance), "ETH");
}

main().catch(console.error);
