import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther, hexToString, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import MyToken from "../../contracts/MyToken.json";
import TokenizedBallot from "../../contracts/TokenizedBallot.json";

const TOKEN_ADDRESS = "0x2bee3a9005ca1deb59a4b65cda024f407b950c03";
const BALLOT_ADDRESS = "0x945b8bef68348aae5ca907913c00ea89377f2323";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// ✅ Fixed API Button
function RequestTokens({ address }: { address: string }) {
  const [result, setResult] = useState<string | null>(null);

  const requestTokens = async () => {
    try {
      const res = await fetch(
        `http://172.28.113.50:3001/mint-and-prepare?address=${address}`
      );
      const data = await res.json();
      setResult(data.result ?? "✅ Request sent!");
    } catch (err) {
      setResult("❌ Error calling API.");
    }
  };

  return (
    <div className="mt-4">
      <button onClick={requestTokens} className="btn btn-primary">
        Request Voting Tokens
      </button>
      {result && <p className="text-sm mt-2">{result}</p>}
    </div>
  );
}

export function BallotDashboard() {
  const { address } = useAccount();
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [proposals, setProposals] = useState<
    { name: string; votes: bigint }[]
  >([]);

  const { data: tokenBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: MyToken.abi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: count } = useReadContract({
    address: BALLOT_ADDRESS,
    abi: TokenizedBallot.abi,
    functionName: "getProposalsCount",
  });

  useEffect(() => {
    if (count && typeof count === "bigint") {
      setProposalCount(Number(count));
    }
  }, [count]);

  useEffect(() => {
    async function fetchProposals() {
      if (!proposalCount) return;

      const results = await Promise.all(
        Array.from({ length: proposalCount }).map(async (_, i) => {
          const nameHex = await publicClient.readContract({
            address: BALLOT_ADDRESS,
            abi: TokenizedBallot.abi,
            functionName: "getProposalName",
            args: [BigInt(i)],
          });

          const votes = await publicClient.readContract({
            address: BALLOT_ADDRESS,
            abi: TokenizedBallot.abi,
            functionName: "getProposalVotes",
            args: [BigInt(i)],
          });

          return {
            name: hexToString(nameHex as `0x${string}`),
            votes: votes as bigint,
          };
        })
      );

      setProposals(results);
    }

    fetchProposals();
  }, [proposalCount]);

  return (
    <div className="card bg-base-100 shadow-xl p-4 mt-6">
      <h2 className="card-title text-xl">🗳️ Ballot Dashboard</h2>
      <p className="text-sm">
        Token Balance:{" "}
        {tokenBalance ? formatEther(tokenBalance as bigint) : "-"}
      </p>
      <ul className="mt-4 space-y-2">
        {proposals.map((p, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{p.name}</span>
            <span>{p.votes.toString()} votes</span>
          </li>
        ))}
      </ul>
      {/* Request voting tokens */}
      {address && <RequestTokens address={address} />}
    </div>
  );
}
