"use client";

// Uncomment this out
// import React, { useEffect, useState } from "react";
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

  // const [pools, setPools] = useState<PoolMetadata[]>([]);
  // const [loading, setLoading] = useState(true);

  // Get rid of these placeholder data when ap fetches pools as expected
  const pools = [
    {
      name: "test1",
      address: "drysdtstrsrssydysrystrst",
      description: "a test sample",
      category: "medical",
      goal: "save a life",
      deadline: "11-04-2025",
      balance: "200",
      withdrawn: false,
      visibilityRaw: "public",
    },
    {
      name: "test1",
      address: "drysdtstrsrssydysrystrst",
      description: "a test sample",
      category: "medical",
      goal: "save a life",
      deadline: "11-04-2025",
      balance: "200",
      withdrawn: false,
      visibilityRaw: "public",
    },
    {
      name: "test1",
      address: "drysdtstrsrssydysrystrst",
      description: "a test sample",
      category: "medical",
      goal: "save a life",
      deadline: "11-04-2025",
      balance: "200",
      withdrawn: false,
      visibilityRaw: "public",
    },
    {
      name: "test1",
      address: "drysdtstrsrssydysrystrst",
      description: "a test sample",
      category: "medical",
      goal: "save a life",
      deadline: "11-04-2025",
      balance: "200",
      withdrawn: false,
      visibilityRaw: "public",
    },
  ];

  // Uncomment this out
  // useEffect(() => {
  //   const fetchPools = async () => {
  //     try {
  //       setLoading(true);
  //       const addresses = await getAllPools() as Address[];

  //       const rawPools = await Promise.all(
  //         addresses.map(async (address: Address) => {
  //           try {
  //             const contract = getContract({
  //               address,
  //               abi,
  //               client: publicClient!,
  //             });

  //             const [
  //               name,
  //               description,
  //               category,
  //               goal,
  //               deadline,
  //               balance,
  //               withdrawn,
  //               visibilityRaw,
  //             ] = await Promise.all([
  //               contract.read.name() as Promise<string>,
  //               contract.read.description() as Promise<string>,
  //               contract.read.category() as Promise<string>,
  //               contract.read.goal() as Promise<bigint>,
  //               contract.read.deadline() as Promise<bigint>,
  //               contract.read.getTotalBalance() as Promise<bigint>,
  //               contract.read.withdrawn() as Promise<boolean>,
  //               contract.read.visibility?.().catch(() => "unknown") as Promise<"public" | "private" | "unknown">,
  //             ]);

  //             return {
  //               address,
  //               name,
  //               description,
  //               category,
  //               goal: goal.toString(),
  //               deadline: deadline.toString(),
  //               balance: balance.toString(),
  //               withdrawn,
  //               visibility: visibilityRaw ?? "unknown",
  //             };
  //           } catch (err) {
  //             console.warn(`⚠️ Skipping pool ${address} due to read error:`, err);
  //             return null;
  //           }
  //         })
  //       );

  //       const filteredPools = rawPools.filter(
  //         (p): p is PoolMetadata => p !== null && p.visibility === "public"
  //       );

  //       setPools(filteredPools);
  //     } catch (error) {
  //       console.error("❌ Error fetching pools:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPools();
  // }, [getAllPools, publicClient]);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">🪙 Community Pools</h2>
      {/* {loading ? (
        <p>Loading pools...</p>
      ) : } */}
      {pools.length === 0 ? (
        <p>No pools created yet. Be the first to create one!</p>
      ) : (
        pools.map(pool => (
          <PoolCard key={pool.address} {...pool} />
        ))
      )}
    </div>
  );
};

export default PoolList;
