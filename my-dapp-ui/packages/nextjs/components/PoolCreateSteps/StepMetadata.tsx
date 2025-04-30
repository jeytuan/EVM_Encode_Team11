"use client";

import React from "react";
import { StepMetadataProps } from "@/types/poolWizardTypes";

const StepMetadata: React.FC<StepMetadataProps> = ({ formData, updateFormData, goNext, goBack }) => {
  return (
    <div className="max-w-md mx-auto bg-base-100 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">📋 Pool Details</h2>
      <p className="mb-4 text-neutral">Give your pool a name, a short description, and assign a category.</p>

      <label className="block mb-3">
        <span className="text-sm font-medium">Name</span>
        <input
          type="text"
          className="input input-bordered rounded-lg w-full mt-1"
          value={formData.name}
          onChange={e => updateFormData({ name: e.target.value })}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium">Description</span>
        <textarea
          className="textarea textarea-bordered rounded-lg w-full mt-1"
          value={formData.description}
          rows={4}
          onChange={e => updateFormData({ description: e.target.value })}
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium">Category</span>
        <select
          className="select select-bordered rounded-lg w-full mt-1"
          value={formData.category}
          onChange={e => updateFormData({ category: e.target.value })}
        >
          <option value="Charity">Charity</option>
          <option value="Education">Education</option>
          <option value="Medical">Medical</option>
          <option value="Art">Art</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <div className="mt-6 flex justify-between">
        <button onClick={goBack} className="btn btn-secondary">
          ← Back
        </button>
        <button
          onClick={goNext}
          className="btn btn-primary"
          disabled={!formData.name || !formData.description}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default StepMetadata;
