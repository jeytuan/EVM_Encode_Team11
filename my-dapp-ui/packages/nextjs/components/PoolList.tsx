"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { getContract, type Address, type Abi } from "viem";
import PoolAbi from "@/contracts/Pool.json";
import PoolCard from "./PoolCard";
// import PoolAbi from "@/contracts/Pool.json";
// import { usePoolFactory } from "@/hooks/scaffold-eth/usePoolFactory";
// import { type Abi, type Address, getContract } from "viem";
// import { usePublicClient } from "wagmi";


// const abi = PoolAbi.abi as Abi;

// Uncomment this out

// interface PoolMetadata {
//   address: string;
//   name: string;
//   description: string;
//   category: string;
//   goal: string;
//   deadline: string;
//   balance: string;
//   withdrawn: boolean;
//   visibility: "public" | "private" | "unknown";
// }

const PoolList: React.FC = () => {
  // Uncomment this out
  // const { getAllPools } = usePoolFactory();
  // const publicClient = usePublicClient();

  const [pools, setPools] = useState<PoolMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPools = useCallback(async () => {
    if (!publicClient) {
      console.warn("⚠️ Public client not ready yet");
      return;
    }

    try {
      setLoading(true);
      const addresses = await getAllPools();
      console.log("🎯 Fetched Pool addresses:", addresses);

      const rawPools = await Promise.all(
        (addresses as Address[]).map(async (address: Address) => {
          try {
            const contract = getContract({
              address,
              abi,
              client: publicClient,
            });

            const [
              name,
              description,
              category,
              goal,
              deadline,
              balance,
              withdrawn,
              visibilityRaw,
            ] = await Promise.all([
              contract.read.name() as Promise<string>,
              contract.read.description() as Promise<string>,
              contract.read.category() as Promise<string>,
              contract.read.goal() as Promise<bigint>,
              contract.read.deadline() as Promise<bigint>,
              contract.read.getTotalBalance() as Promise<bigint>,
              contract.read.withdrawn() as Promise<boolean>,
              contract.read.visibility().catch(err => {
                console.warn(`⚠️ visibility() call failed on ${address}:`, err);
                return "unknown";
              }) as Promise<string>,
            ]);

            const cleanVisibility = (visibilityRaw || "").toLowerCase().trim();
            const finalVisibility: "public" | "private" | "unknown" =
              cleanVisibility === "public"
                ? "public"
                : cleanVisibility === "private"
                ? "private"
                : "unknown";

            console.log(`📦 Pool @ ${address}:`, {
              name,
              visibility: finalVisibility,
              description,
              goal: goal.toString(),
              deadline: deadline.toString(),
              balance: balance.toString(),
              withdrawn,
            });

            return {
              address,
              name,
              description,
              category,
              goal: goal.toString(),
              deadline: deadline.toString(),
              balance: balance.toString(),
              withdrawn,
              visibility: finalVisibility,
            };
          } catch (err) {
            console.warn(`❌ Skipping pool ${address} due to read error:`, err);
            return null;
          }
        })
      );

      const filteredPools = rawPools.filter(
        (p): p is PoolMetadata => p !== null && p.visibility === "public"
      );

      console.log(`🔎 Raw pools total: ${rawPools.length}`);
      console.log(`✅ Public pools filtered: ${filteredPools.length}`);

      setPools(filteredPools);
    } catch (error) {
      console.error("❌ Error fetching pools:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllPools, publicClient]);

  // ✅ Initial load only once
  useEffect(() => {
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">🪙 Community Pools</h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={fetchPools}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {loading ? (
        <p>Loading pools...</p>
      ) : pools.length === 0 ? (
        <p>No public pools found. Try creating one or ensure your contracts are correct.</p>
      ) : (
        pools.map(pool => (
          <PoolCard key={pool.address} {...pool} />
        ))
      )}
    </div>
  );
};

export default PoolList;
