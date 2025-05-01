import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config();

// Cast private keys as `0x${string}` for strict type compatibility
const OLD_PRIVATE_KEY = `0x${process.env.PRIVATE_KEY!}` as `0x${string}`;
const NEW_PRIVATE_KEY = `0x${process.env.PRIVATE_KEY_CHAIRPERSON!}` as `0x${string}`;

const oldAccount = privateKeyToAccount(OLD_PRIVATE_KEY);
const newAccount = privateKeyToAccount(NEW_PRIVATE_KEY);

const walletClient = createWalletClient({
  account: oldAccount,
  chain: sepolia,
  transport: http(),
});

async function main() {
  const txHash = await walletClient.sendTransaction({
    to: newAccount.address as `0x${string}`, // cast for type safety
    value: parseEther('0.1'), // adjust this if needed
  });

  console.log(`✅ Sent 0.1 ETH from ${oldAccount.address} to ${newAccount.address}`);
  console.log(`🔗 TX Hash: https://sepolia.etherscan.io/tx/${txHash}`);
}

main().catch((err) => {
  console.error('❌ Error sending ETH:', err);
});
