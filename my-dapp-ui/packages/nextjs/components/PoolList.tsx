// my-dapp-ui/packages/nextjs/components/PoolList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { getContract, type Address, type Abi } from "viem";
import PoolAbi from "@/contracts/Pool.json";
import PoolCard from "./PoolCard";
import { usePoolFactory } from "@/hooks/scaffold-eth/usePoolFactory";

const abi = PoolAbi.abi as Abi;

interface PoolMetadata {
  address: string;
  name: string;
  description: string;
  category: string;
  goal: string;
  deadline: string;
  balance: string;
  withdrawn: boolean;
  visibility: "public" | "private" | "unknown";
}

const PoolList: React.FC = () => {
  const { getAllPools } = usePoolFactory();
  const publicClient = usePublicClient();

  const [pools, setPools] = useState<PoolMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  // define a stand-alone refresh function
  const refresh = async () => {
    if (!publicClient) return;
    setLoading(true);
    try {
      const addresses = (await getAllPools()) as Address[];
      const raw = await Promise.all(
        addresses.map(async (address) => {
          try {
            const ctr = getContract({ address, abi, client: publicClient });
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
              ctr.read.name() as Promise<string>,
              ctr.read.description() as Promise<string>,
              ctr.read.category() as Promise<string>,
              ctr.read.goal() as Promise<bigint>,
              ctr.read.deadline() as Promise<bigint>,
              ctr.read.getTotalBalance() as Promise<bigint>,
              ctr.read.withdrawn() as Promise<boolean>,
              ctr.read
                .visibility()
                .catch(() => "unknown") as Promise<string>,
            ]);

            const vis = (visibilityRaw || "").toLowerCase().trim();
            const finalVis: PoolMetadata["visibility"] =
              vis === "public"
                ? "public"
                : vis === "private"
                ? "private"
                : "unknown";

            return {
              address,
              name,
              description,
              category,
              goal: goal.toString(),
              deadline: new Date(Number(deadline) * 1000).toLocaleString(),
              balance: balance.toString(),
              withdrawn,
              visibility: finalVis,
            };
          } catch {
            return null;
          }
        })
      );

      setPools(raw.filter((x): x is PoolMetadata => x !== null && x.visibility === "public"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // only on mount:
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">🪙 Community Pools</h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {loading && <p>Loading pools…</p>}
      {!loading && pools.length === 0 && (
        <p>No public pools found. Create one to get started!</p>
      )}
      {!loading && pools.length > 0 && (
        <div className="space-y-2">
          {pools.map((pool) => (
            <div
              key={pool.address}
              className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div className="collapse-title flex justify-between items-center text-lg font-medium">
                <span>{pool.name}</span>
                <span className="text-xs text-gray-500">
                  {pool.address.slice(0, 6)}…{pool.address.slice(-4)}
                </span>
              </div>
              <div className="collapse-content pt-0">
                <PoolCard {...pool} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoolList;
