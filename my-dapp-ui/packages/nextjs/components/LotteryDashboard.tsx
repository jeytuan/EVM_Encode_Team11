import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { readContract } from "viem/actions";
import LotteryArtifact from "../contracts/Lottery/Lottery.json";

const LotteryAbi = LotteryArtifact.abi;
const LOTTERY_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as `0x${string}`;

export const LotteryDashboard = () => {
  const [betsOpen, setBetsOpen] = useState<boolean | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!publicClient) {
        console.warn("🔌 publicClient not ready");
        return;
      }

      try {
        const result = await readContract(publicClient, {
          address: LOTTERY_ADDRESS,
          abi: LotteryAbi,
          functionName: "betsOpen",
          args: [],
        });

        setBetsOpen(result as boolean);
      } catch (error) {
        console.error("❌ Error reading from Lottery:", error);
      }
    };

    fetchData();
  }, [publicClient]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">🎲 Lottery Dashboard</h2>
      <p className="text-sm text-gray-500">
        Bets open:{" "}
        {betsOpen === null ? (
          <span className="italic text-gray-400">Loading...</span>
        ) : betsOpen ? (
          "Yes"
        ) : (
          "No"
        )}
      </p>
    </div>
  );
};
