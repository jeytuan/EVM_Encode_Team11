import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import { getContract } from 'viem';
import { abi } from '../artifacts/contracts/MyNFT.sol/MyNFT.json'; // Replace with your contract
import { parseAbi } from 'viem';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY_CHAIRPERSON!;
const CONTRACT_ADDRESS = 'PUT_YOUR_ERC721_CONTRACT_ADDRESS_HERE'; // <- replace this
const TOKEN_URI = 'ipfs://bafybeifzh7ssee327ic5kyxnkjpyfnfpes5te3xa37j3tz4npl75yn6esq/Fire_Woodpecker.json';

async function main() {
  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const contract = getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: parseAbi([
      'function safeMint(address to, string memory uri) public returns (uint256)'
    ]), // Modify to match your contract's function signature
    client: walletClient,
  });

  const hash = await contract.write.safeMint([account.address, TOKEN_URI]);
  console.log(`✅ Mint transaction sent! TX: https://sepolia.etherscan.io/tx/${hash}`);
}

main().catch((err) => {
  console.error('❌ Minting failed:', err);
});
