"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { usePublicClient } from "wagmi";
import { getContract, type Address, type Abi } from "viem";
import { usePoolFactory } from "~~/hooks/scaffold-eth/usePoolFactory";
import PoolAbi from "~~/contracts/Pool.json";
import PoolCard from "~~/components/PoolCard";
import { Avatar } from "~~/components/ui/avatar";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

////////////////////////////////////////////////////////////////////////////////
// DryplingCard
////////////////////////////////////////////////////////////////////////////////
const DryplingCard: React.FC<{ drypling: { id: number; name: string; image_url: string } }> = ({
  drypling,
}) => (
  <div className="border rounded-lg p-4 text-center shadow-sm">
    <img
      src={drypling.image_url}
      alt={drypling.name}
      className="mx-auto mb-2 w-24 h-24 object-cover rounded-full"
    />
    <h3 className="font-semibold">{drypling.name}</h3>
    <p className="text-sm text-gray-600">ID: {drypling.id}</p>
  </div>
);

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
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

const abi = PoolAbi.abi as Abi;

// instantiate Supabase client once
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

////////////////////////////////////////////////////////////////////////////////
// Page component
////////////////////////////////////////////////////////////////////////////////
export default function ProfilePage() {
  const params = useParams();
  const addressParam = params?.address as string | undefined;
  const profileAddress = addressParam?.toLowerCase() ?? "";

  // on-chain
  const publicClient = usePublicClient();
  const { getAllPools } = usePoolFactory();

  // state: pools
  const [pools, setPools] = useState<PoolMetadata[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [openPool, setOpenPool] = useState<string | null>(null);

  // state: dryplings
  const [dryplings, setDryplings] = useState<
    { id: number; name: string; image_url: string }[]
  >([]);
  const [loadingDryplings, setLoadingDryplings] = useState(true);

  // sanity‐check: log raw contents of dryplings table
  useEffect(() => {
    supabase
      .from("dryplings")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error("❌ supabase error:", error);
        else console.log("✅ dryplings table rows:", data);
      });
  }, []);

  // fetch this user’s on-chain pools
  useEffect(() => {
    const fetchPools = async () => {
      if (!publicClient || !profileAddress) return;
      setLoadingPools(true);
      try {
        const allAddrs = (await getAllPools()) as Address[];
        const out = await Promise.all(
          allAddrs.map(async (addr) => {
            try {
              const ctr = getContract({ address: addr, abi, client: publicClient });
              const creator = (await ctr.read.creator()) as `0x${string}`;
              if (creator.toLowerCase() !== profileAddress) return null;

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
                ctr
                  .read.visibility?.()
                  .then((v) => v as string)
                  .catch(() => "unknown"),
              ]);

              const vis = (visibilityRaw || "").toLowerCase().trim();
              const finalVis: PoolMetadata["visibility"] =
                vis === "public" ? "public" : vis === "private" ? "private" : "unknown";

              return {
                address: addr,
                name,
                description,
                category,
                goal: goal.toString(),
                deadline: new Date(Number(deadline) * 1000).toLocaleString(),
                balance: balance.toString(),
                withdrawn,
                visibility: finalVis,
              } as PoolMetadata;
            } catch {
              return null;
            }
          })
        );
        setPools(out.filter((p): p is PoolMetadata => p !== null));
      } catch (e) {
        console.error("❌ Failed to load creator pools:", e);
      } finally {
        setLoadingPools(false);
      }
    };
    fetchPools();
    // only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAddress]);

  // fetch this user’s Dryplings from Supabase
  useEffect(() => {
    const fetchDryplings = async () => {
      if (!profileAddress) {
        setDryplings([]);
        setLoadingDryplings(false);
        return;
      }
      setLoadingDryplings(true);
      try {
        const { data, error } = await supabase
          .from("dryplings")
          .select("id, name, image_url")
          .eq("owner_id", profileAddress); // assuming owner_id holds wallet address
        if (error) {
          console.error("❌ Error loading dryplings:", error);
          setDryplings([]);
        } else {
          setDryplings(data || []);
        }
      } catch (e) {
        console.error("❌ Unexpected error:", e);
        setDryplings([]);
      } finally {
        setLoadingDryplings(false);
      }
    };
    fetchDryplings();
  }, [profileAddress]);

  return (
    <div className="container mx-auto p-6">
      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="w-28 h-28">
          {profileAddress.slice(2, 4).toUpperCase()}
        </Avatar>
        <h1 className="text-2xl font-bold">{profileAddress}</h1>
        <p className="text-gray-500">This is a user profile. Bio TBD.</p>
      </div>

      {/* CREATED POOLS */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">🔨 Created Pools</h2>
        {loadingPools ? (
          <p>Loading…</p>
        ) : pools.length === 0 ? (
          <p className="text-gray-600">No pools found for this user.</p>
        ) : (
          <div className="space-y-2 mt-4">
            {pools.map((pool) => (
              <div key={pool.address} className="border rounded-lg overflow-hidden">
                <div
                  className="px-4 py-3 bg-secondary/30 cursor-pointer flex justify-between items-center"
                  onClick={() => setOpenPool(openPool === pool.address ? null : pool.address)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{pool.name}</h3>
                    <p className="text-sm text-gray-200">
                      {pool.address.slice(0, 6)}…{pool.address.slice(-4)}
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gray-300 transform transition-transform ${
                      openPool === pool.address ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openPool === pool.address && (
                  <div className="p-4 bg-secondary/20">
                    <PoolCard {...pool} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DRYPLINGS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">🦋 Your Dryplings</h2>
        {loadingDryplings ? (
          <p>Loading dryplings…</p>
        ) : dryplings.length === 0 ? (
          <p className="text-gray-600">You haven’t forged any Dryplings yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dryplings.map((d) => (
              <DryplingCard key={d.id} drypling={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
