"use client";

import React, { useState } from "react";
import EventTypeStep from "./PoolCreateSteps/EventTypeStep";
import StepVisibility from "./PoolCreateSteps/StepVisibility";
import StepFunding from "./PoolCreateSteps/StepFunding";
import StepMetadata from "./PoolCreateSteps/StepMetadata";
import StepReview from "./PoolCreateSteps/StepReview";
import type { FormData } from "@/types/poolWizardTypes";

const PoolCreateWizard = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    eventType: "",
    visibility: "public",
    goalUsd: "",
    minContributionUsd: "",
    duration: "",
    name: "",
    description: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const goNext = () => setStepIndex(prev => Math.min(prev + 1, 4));
  const goBack = () => setStepIndex(prev => Math.max(prev - 1, 0));

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Submitting pool:", formData);

      // 🪄 Simulate API call
      setTimeout(() => {
        setTxHash("0x123abc456mockedtxhash789xyz");
        setLoading(false);
      }, 2000);
    } catch (e) {
      console.error("❌ Submission failed", e);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      {stepIndex === 0 && (
        <EventTypeStep formData={formData} updateFormData={updateFormData} goNext={goNext} />
      )}
      {stepIndex === 1 && (
        <StepVisibility formData={formData} updateFormData={updateFormData} goNext={goNext} goBack={goBack} />
      )}
      {stepIndex === 2 && (
        <StepFunding formData={formData} updateFormData={updateFormData} goNext={goNext} goBack={goBack} />
      )}
      {stepIndex === 3 && (
        <StepMetadata formData={formData} updateFormData={updateFormData} goNext={goNext} goBack={goBack} />
      )}
      {stepIndex === 4 && (
        <StepReview formData={formData} goBack={goBack} onSubmit={handleSubmit} loading={loading} txHash={txHash} />
      )}
    </div>
  );
};

export default PoolCreateWizard;
