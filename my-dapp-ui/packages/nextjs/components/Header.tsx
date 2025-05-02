"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

/**
 * Static links (Home, Dryplings & Create Pool)
 */
export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Dryplings",
    href: "/dryplings",
    icon: <span className="text-lg">🦋</span>,
  },
  {
    label: "Create Pool",
    href: "/createPool",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

/**
 * Renders both the static links and, if connected, the dynamic Profile link.
 */
export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}

      {/* only show “Profile” once wallet’s connected */}
      {isConnected && address && (
        <li key="profile">
          <Link
            href={`/profile/${address}`}
            className={`${
              pathname === `/profile/${address}` ? "bg-secondary shadow-md" : ""
            } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full`}
          >
            Profile
          </Link>
        </li>
      )}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(burgerMenuRef, useCallback(() => setIsDrawerOpen(false), []));

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* mobile burger */}
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${
              isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"
            }`}
            onClick={() => setIsDrawerOpen(x => !x)}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {/* logo + desktop nav */}
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="relative w-10 h-10">
            <Image alt="Drypto logo" fill src="/logo.svg" className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Drypto</span>
            <span className="text-xs">Ethereum dev stack</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* wallet + faucet */}
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
