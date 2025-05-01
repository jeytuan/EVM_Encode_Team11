"use client";

import React from "react";
import type { FormData } from "@/types/poolWizardTypes";

interface EventTypeStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  goNext: () => void;
}

const eventTypes = [
  { label: "🌴 Group Trip", value: "Group Trip" },
  { label: "🎉 Event", value: "Event" },
  { label: "🏠 Shared Household Expense", value: "Shared Household Expense" },
  { label: "💖 Community Fundraiser", value: "Community Fundraiser" },
  { label: "🤝 Collaborative Project", value: "Collaborative Project" },
];

const EventTypeStep: React.FC<EventTypeStepProps> = ({ formData, updateFormData, goNext }) => {
  const handleSelect = (value: string) => {
    updateFormData({ eventType: value });
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-6 rounded shadow">
      <h2 className="text-xl text-neutral font-bold mb-4">📌 Select Event Type</h2>
      <p className="mb-4 text-neutral">What kind of pool are you setting up?</p>

      <div className="space-y-2">
        {eventTypes.map(event => (
          <button
            key={event.value}
            className={`w-full text-left text-neutral px-4 py-3 rounded border transition ${
              formData.eventType === event.value
                ? "bg-blue-100 border-blue-500 text-black"
                : "bg-gray-300 border-gray-400 hover:bg-gray-600 hover:text-gray-800"
            }`}
            onClick={() => handleSelect(event.value)}
          >
            {event.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={goNext} className="btn btn-primary text-neutral" disabled={!formData.eventType}>
          Continue →
        </button>
      </div>
    </div>
  );
};

export default EventTypeStep;
