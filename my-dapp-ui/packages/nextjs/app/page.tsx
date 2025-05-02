// packages/nextjs/app/page.tsx
"use client";

import type { NextPage } from "next";
import Image from "next/image";
import PoolDashboard from "~/components/PoolDashboard";

const Home: NextPage = () => {
  return (
    <>
      {/* ───────────── Pool Dashboard ───────────── */}
      <div className="flex flex-col items-center flex-grow pt-10 pb-12">
        <div className="w-full px-5 mt-10">
          <PoolDashboard />
        </div>
      </div>

      {/* ───────────── Bottom Hero Section ───────────── */}
      <section className="relative w-full bg-gray-900 overflow-hidden">
        <div className="relative w-full max-w-screen-xl mx-auto h-80 md:h-96 lg:h-[500px]">
          <Image
            src="/images/hero-placeholder.png"
            alt="Forge Your Drypling"
            fill
            className="object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
              Forge Your Drypling
            </h1>
            <p className="mt-2 text-sm md:text-lg lg:text-xl drop-shadow-md">
              Embark on your cosmic pet journey
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
