"use client";

import React from "react";
import Link from "next/link";

export default function DryplingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🦋 Dryplings Factory
      </h1>
      <p className="mb-6 text-gray-300">
        Welcome to the Primal-Remix Astrology Drypling creator. This is where
        you’ll hatch, name, and customize your very own Dryplings!
      </p>

      {/* Placeholder “Start Creating” button */}
      <Link href="/dryplings/create">
        <button className="btn btn-primary">
          🚀 Start Creating a Drypling
        </button>
      </Link>

      {/* TODO: grid of existing Dryplings, stats, lore, etc. */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">
          Your Dryplings Gallery
        </h2>
        <p className="text-gray-500">Coming soon…</p>
        {/* later: map over on-chain Dryplings and show DryplingCard */}
      </section>
    </div>
  );
}
