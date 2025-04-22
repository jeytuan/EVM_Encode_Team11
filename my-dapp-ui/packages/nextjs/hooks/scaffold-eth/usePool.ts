import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useCallback } from "react";
import {
  getContract,
  type Abi,
  type Address,
  type PublicClient,
  type WalletClient,
} from "viem";
import PoolArtifact from "@/contracts/Pool.json";

const abi = PoolArtifact.abi as Abi;

export function usePool(poolAddress: Address) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const getWriteContract = (client: WalletClient) =>
    getContract({
      address: poolAddress,
      abi,
      client,
    });

  const getReadContract = (client: PublicClient) =>
    getContract({
      address: poolAddress,
      abi,
      client,
    });

  const contribute = useCallback(
    async (amountEth: string) => {
      if (!walletClient || !address) throw new Error("Wallet not connected");

      const contract = getWriteContract(walletClient);
      const amount = BigInt(parseFloat(amountEth) * 1e18);

      return await contract.write.contribute([], {
        account: address,
        value: amount,
      });
    },
    [walletClient, address, poolAddress]
  );

  const withdraw = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");

    const contract = getWriteContract(walletClient);

    return await contract.write.withdraw([], {
      account: address,
    });
  }, [walletClient, address, poolAddress]);

  const getTotalBalance = useCallback(async () => {
    if (!publicClient) throw new Error("Client not ready");

    const contract = getReadContract(publicClient);
    return await contract.read.getTotalBalance();
  }, [publicClient, poolAddress]);

  const getMyContribution = useCallback(async () => {
    if (!publicClient || !address) throw new Error("Client or address missing");

    const contract = getReadContract(publicClient);
    return await contract.read.getMyContribution({
      account: address,
    });
  }, [publicClient, address, poolAddress]);

  return {
    contribute,
    withdraw,
    getTotalBalance,
    getMyContribution,
    poolAddress,
  };
}
