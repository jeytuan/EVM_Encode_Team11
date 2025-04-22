"use client";

import React, { useEffect, useState } from "react";
import type { FormData } from "@/types/poolWizardTypes";

interface StepFundingProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  goNext: () => void;
  goBack: () => void;
}

const STATIC_USD_TO_ETH_RATE = 3000; // $3000 per 1 ETH for mock display

const StepFunding: React.FC<StepFundingProps> = ({ formData, updateFormData, goNext, goBack }) => {
  const [goalEth, setGoalEth] = useState("");
  const [minEth, setMinEth] = useState("");

  useEffect(() => {
    const convertFiatToEth = () => {
      if (formData.goalUsd) {
        const eth = (parseFloat(formData.goalUsd) / STATIC_USD_TO_ETH_RATE).toFixed(4);
        setGoalEth(eth);
      }
      if (formData.minContributionUsd) {
        const eth = (parseFloat(formData.minContributionUsd) / STATIC_USD_TO_ETH_RATE).toFixed(4);
        setMinEth(eth);
      }
    };

    convertFiatToEth();
  }, [formData.goalUsd, formData.minContributionUsd]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">💰 Pool Funding Details</h2>
      <p className="mb-4 text-gray-600">Set your funding target and contribution thresholds.</p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Goal (in USD)</label>
        <input
          type="number"
          placeholder="e.g. 1000"
          value={formData.goalUsd}
          onChange={e => updateFormData({ goalUsd: e.target.value })}
          className="input input-bordered w-full"
        />
        {goalEth && (
          <p className="text-sm text-gray-500 mt-1">≈ {goalEth} ETH (based on mock $3k/ETH)</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Minimum Contribution (in USD)</label>
        <input
          type="number"
          placeholder="e.g. 10"
          value={formData.minContributionUsd}
          onChange={e => updateFormData({ minContributionUsd: e.target.value })}
          className="input input-bordered w-full"
        />
        {minEth && (
          <p className="text-sm text-gray-500 mt-1">≈ {minEth} ETH (mock conversion)</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Duration (in days)</label>
        <input
          type="number"
          placeholder="e.g. 7"
          value={formData.duration}
          onChange={e => updateFormData({ duration: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button className="btn btn-secondary" onClick={goBack}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={goNext}
          disabled={!formData.goalUsd || !formData.minContributionUsd || !formData.duration}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default StepFunding;
