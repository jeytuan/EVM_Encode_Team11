import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import MyToken from "../artifacts/contracts/MyToken.sol/MyToken.json";

const TOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
const WALLET = "0xbbc48f914D62bc24cF686E6Ef64f9BBac24bdbD4";

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

async function main() {
    const balance = await client.readContract({
        address: TOKEN_ADDRESS,
        abi: MyToken.abi,
        functionName: "balanceOf",
        args: [WALLET],
      }) as bigint;
      
  console.log("💰 Balance of", WALLET, "is:", balance.toString());
}

main();
