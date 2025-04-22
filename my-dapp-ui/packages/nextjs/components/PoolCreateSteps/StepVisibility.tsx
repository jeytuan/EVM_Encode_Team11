"use client";

import React from "react";
import type { FormData } from "@/types/poolWizardTypes";

interface StepVisibilityProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  goNext: () => void;
  goBack: () => void;
}

const StepVisibility: React.FC<StepVisibilityProps> = ({ formData, updateFormData, goNext, goBack }) => {
  const { visibility } = formData;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">🔐 Visibility Settings</h2>
      <p className="mb-4 text-gray-600">Choose who can view and access this pool.</p>

      <div className="space-y-4">
        <label className="block cursor-pointer">
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={visibility === "public"}
            onChange={() => updateFormData({ visibility: "public" })}
            className="mr-2"
          />
          🌍 Public — Anyone with the link can see and contribute
        </label>
        <label className="block cursor-pointer">
          <input
            type="radio"
            name="visibility"
            value="private"
            checked={visibility === "private"}
            onChange={() => updateFormData({ visibility: "private" })}
            className="mr-2"
          />
          🙈 Private — Only invited users can view and contribute
        </label>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={goBack} className="btn btn-secondary">
          ← Back
        </button>
        <button onClick={goNext} className="btn btn-primary">
          Continue →
        </button>
      </div>
    </div>
  );
};

export default StepVisibility;
