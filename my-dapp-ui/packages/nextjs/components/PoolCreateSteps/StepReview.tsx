"use client";

import React, { useState } from "react";
import type { StepReviewProps } from "@/types/poolWizardTypes";
import { usePoolFactory } from "@/hooks/scaffold-eth/usePoolFactory";

const StepReview: React.FC<StepReviewProps> = ({ formData, goBack }) => {
  const { createPool } = usePoolFactory();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const {
    eventType,
    visibility,
    goalUsd,
    minContributionUsd,
    duration,
    name,
    description,
    category,
  } = formData;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const txHash = await createPool(formData);
      if (txHash) {
        setTxHash(txHash as string);
      } else {
        throw new Error("Transaction hash not returned");
      }
    } catch (err: any) {
      console.error("❌ Pool creation failed:", err);
      setError(err?.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">✅ Review & Confirm</h2>
      <p className="mb-4 text-neutral">Please review your pool details before finalizing.</p>

      <div className="space-y-3 text-sm">
        <div><strong>Event Type:</strong> {eventType}</div>
        <div><strong>Visibility:</strong> {visibility}</div>
        <div><strong>Goal:</strong> ${goalUsd} (≈ {(parseFloat(goalUsd) / 3000).toFixed(4)} ETH)</div>
        <div><strong>Min Contribution:</strong> ${minContributionUsd} (≈ {(parseFloat(minContributionUsd) / 3000).toFixed(4)} ETH)</div>
        <div><strong>Duration:</strong> {duration} days</div>
        <div><strong>Pool Name:</strong> {name}</div>
        <div><strong>Description:</strong> {description}</div>
        <div><strong>Category:</strong> {category}</div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={goBack} className="btn btn-secondary" disabled={loading}>
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Pool"}
        </button>
      </div>

      {txHash && (
        <div className="mt-4 text-green-600 text-xs break-words">
          ✅ Pool created successfully! Tx: <span className="break-all">{txHash}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-xs break-words">
          ⚠️ Error: <span className="break-all">{error}</span>
        </div>
      )}
    </div>
  );
};

export default StepReview;
