import * as chains from "viem/chains";
import MyTokenAbi from "./contracts/MyToken.json";
import TokenizedBallotAbi from "./contracts/TokenizedBallot.json";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  deployedContracts?: Record<number, Record<string, { address: string; abi: any }>>;
};

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const scaffoldConfig = {
  targetNetworks: [chains.sepolia],

  pollingInterval: 30000,

  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  rpcOverrides: {
    // Optional if you're using Alchemy, but you can set your own here.
  },

  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  onlyLocalBurnerWallet: false,

  deployedContracts: {
    [chains.sepolia.id]: {
      MyToken: {
        address: "0x2bee3a9005ca1deb59a4b65cda024f407b950c03",
        abi: MyTokenAbi.abi,
      },
      TokenizedBallot: {
        address: "0x15d54584363d820958db0acf5b1054a9baa39cac",
        abi: TokenizedBallotAbi.abi,
      },
    },
  },
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
