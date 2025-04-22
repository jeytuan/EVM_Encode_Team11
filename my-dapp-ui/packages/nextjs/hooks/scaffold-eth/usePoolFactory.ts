import { useAccount, useWalletClient, useChainId } from "wagmi";
import { useCallback } from "react";
import { getContract, getAddress, type Abi, type Address } from "viem";
import PoolFactoryArtifact from "@/contracts/PoolFactory.json";
import deployedAddresses from "@/contracts/deployedAddresses.json";
import type { FormData } from "@/types/poolWizardTypes";

const STATIC_USD_TO_ETH = 3000;

export function usePoolFactory() {
  const { data: walletClient } = useWalletClient();
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

  const contract = walletClient && factoryAddress
    ? getContract({
        address: factoryAddress,
        abi,
        client: walletClient,
      })
    : null;

  const createPool = useCallback(
    async (formData: FormData) => {
      if (!contract || !walletClient || !address) throw new Error("Wallet not connected or contract missing");

      const goalEth = parseFloat(formData.goalUsd) / STATIC_USD_TO_ETH;
      const minContributionEth = parseFloat(formData.minContributionUsd) / STATIC_USD_TO_ETH;

      const goal = BigInt(Math.floor(goalEth * 1e18));
      const minContribution = BigInt(Math.floor(minContributionEth * 1e18));
      const duration = parseInt(formData.duration);

      const txHash = await contract.write.createPool(
        [goal, duration, minContribution, formData.category, formData.name, formData.description, formData.visibility],
        { account: address as Address }
      );

      return txHash;
    },
    [walletClient, contract, address]
  );

  const getAllPools = useCallback(async () => {
    if (!contract) throw new Error("Contract not ready");
    return await contract.read.getAllPools();
  }, [contract]);

  const getPoolsByCreator = useCallback(async (creator: Address) => {
    if (!contract) throw new Error("Contract not ready");
    return await contract.read.getPoolsByCreator([creator]);
  }, [contract]);

  return {
    createPool,
    getAllPools,
    getPoolsByCreator,
    poolFactoryAddress: factoryAddress,
  };
}
