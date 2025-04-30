"use client";

import React from "react";
import PoolCreateWizard from "@/components/PoolCreateWizard";

const PoolDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl text-neutral font-bold mb-6">💧 Drypto Pooling Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl text-neutral font-semibold mb-2">🚀 Create a New Pool</h2>
        {/* 👇 swapped in new multi-step form */}
        <PoolCreateWizard />
      </section>
    </div>
  );
};

export default PoolDashboard;
