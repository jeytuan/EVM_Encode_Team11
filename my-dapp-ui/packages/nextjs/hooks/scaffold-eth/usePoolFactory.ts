import { useAccount, useWalletClient, usePublicClient, useChainId } from "wagmi";
import { useCallback } from "react";
import { getContract, getAddress, type Abi, type Address } from "viem";
import PoolFactoryArtifact from "@/contracts/PoolFactory.json";
import deployedAddresses from "@/contracts/deployedAddresses.json";
import type { FormData } from "@/types/poolWizardTypes";

const STATIC_USD_TO_ETH = 3000;

export function usePoolFactory() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const abi = PoolFactoryArtifact.abi as Abi;

  let factoryAddress: Address | undefined;
  try {
    const raw = (deployedAddresses as Record<string, any>)[String(chainId)]?.poolFactory;
    if (raw) {
      factoryAddress = getAddress(raw); // ✅ ensure checksummed format
    }
  } catch (err) {
    console.error("⚠️ Invalid poolFactory address:", err);
  }

  // Contract for writing (needs walletClient)
  const writeContract = walletClient && factoryAddress
    ? getContract({
        address: factoryAddress,
        abi,
        client: walletClient,
      })
    : null;

  // Contract for reading (uses publicClient)
  const readContract = publicClient && factoryAddress
    ? getContract({
        address: factoryAddress,
        abi,
        client: publicClient,
      })
    : null;

  const createPool = useCallback(
    async (formData: FormData) => {
      if (!writeContract || !walletClient || !address) throw new Error("Wallet not connected or contract missing");

      const goalEth = parseFloat(formData.goalUsd) / STATIC_USD_TO_ETH;
      const minContributionEth = parseFloat(formData.minContributionUsd) / STATIC_USD_TO_ETH;

      const goal = BigInt(Math.floor(goalEth * 1e18));
      const minContribution = BigInt(Math.floor(minContributionEth * 1e18));
      const duration = parseInt(formData.duration);

      const category = formData.category?.trim() || "General";

      const txHash = await writeContract.write.createPool(
        [goal, duration, minContribution, category, formData.name, formData.description, formData.visibility],
        { account: address as Address }
      );

      return txHash;
    },
    [walletClient, writeContract, address]
  );

  const getAllPools = useCallback(async () => {
    if (!readContract) throw new Error("Read Contract not ready");
    return await readContract.read.getAllPools();
  }, [readContract]);

  const getPoolsByCreator = useCallback(async (creator: Address) => {
    if (!readContract) throw new Error("Read Contract not ready");
    return await readContract.read.getPoolsByCreator([creator]);
  }, [readContract]);

  return {
    createPool,
    getAllPools,
    getPoolsByCreator,
    poolFactoryAddress: factoryAddress,
  };
}
