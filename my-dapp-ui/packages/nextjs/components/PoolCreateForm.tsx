import React, { useState, useMemo } from "react";
import { usePoolFactory } from "@/hooks/scaffold-eth/usePoolFactory";

const PoolCreateForm = () => {
  const { createPool } = usePoolFactory();

  const [goalUsd, setGoalUsd] = useState("");
  const [minContributionUsd, setMinContributionUsd] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Charity");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  // Static conversion rate
  const ETH_RATE = 3000; // 1 ETH = $3000

  // Auto-compute ETH values
  const goalEth = useMemo(() => (parseFloat(goalUsd) / ETH_RATE || 0).toFixed(6), [goalUsd]);
  const minContributionEth = useMemo(() => (parseFloat(minContributionUsd) / ETH_RATE || 0).toFixed(6), [minContributionUsd]);

  const handleCreate = async () => {
    setLoading(true);
    try {
        const tx = await createPool({
            eventType: "QuickForm", // or "Custom", placeholder since PoolCreateForm is not part of wizard
            visibility: "public",   // default public, since there's no toggle in this form
            goalUsd,
            minContributionUsd,
            duration,
            name,
            description,
            category,
          });
          
      setTxHash(tx);
    } catch (err) {
      console.error("❌ Pool creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mt-6">
      <h2 className="text-xl font-bold mb-4">🛠️ Create New Pool</h2>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="label text-sm font-semibold">Goal (USD)</label>
          <input
            placeholder="Goal in USD"
            value={goalUsd}
            onChange={e => setGoalUsd(e.target.value)}
            className="input input-bordered w-full"
          />
          <p className="text-xs text-gray-500 mt-1">≈ {goalEth} ETH</p>
        </div>

        <div>
          <label className="label text-sm font-semibold">Min Contribution (USD)</label>
          <input
            placeholder="Min Contribution in USD"
            value={minContributionUsd}
            onChange={e => setMinContributionUsd(e.target.value)}
            className="input input-bordered w-full"
          />
          <p className="text-xs text-gray-500 mt-1">≈ {minContributionEth} ETH</p>
        </div>

        <input
          placeholder="Duration (days)"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          className="input input-bordered"
        />

        <input
          placeholder="Category (e.g. Charity)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input input-bordered"
        />

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="textarea textarea-bordered"
        />

        <button className="btn btn-primary mt-2" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Pool"}
        </button>

        {txHash && (
          <div className="mt-2 text-sm text-green-600">
            ✅ Pool created! Tx Hash: <span className="break-all">{txHash}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolCreateForm;
