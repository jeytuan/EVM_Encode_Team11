"use client";

import React from "react";
import PoolList from "./PoolList";

const PoolDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <section>
        <h2 className="text-xl text-neutral font-semibold mb-2">🌊 Explore All Pools</h2>
        <PoolList />
      </section>
    </div>
  );
};

export default PoolDashboard;
