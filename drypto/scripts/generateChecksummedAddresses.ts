import { getAddress } from "viem";
import fs from "fs";
import path from "path";

// Raw deployment addresses
const raw = {
  "11155111": {
    poolFactory: "0xb50c464278982f6937d1f5e098028a7833cbc07d",
    lottery: "0xac873a1a08f0014384435b8ee5ae7b2b15fb3374",
    token: "0x6fedd2145b9fb70272c9524dbe51481d4e61a700",
  },
};

// Generate checksummed versions
const checksummed = Object.fromEntries(
  Object.entries(raw).map(([chainId, contracts]) => {
    const formatted = Object.fromEntries(
      Object.entries(contracts).map(([name, address]) => [
        name,
        getAddress(address), // throws if invalid
      ])
    );
    return [chainId, formatted];
  })
);

// Ensure directory exists
const outputDir = path.join(
  __dirname,
  "..",
  "my-dapp-ui",
  "packages",
  "nextjs",
  "contracts"
);
fs.mkdirSync(outputDir, { recursive: true }); // ✅ Create path if missing

// Write to file
const outputPath = path.join(outputDir, "deployedAddresses.json");
fs.writeFileSync(outputPath, JSON.stringify(checksummed, null, 2));
console.log("✅ Synced deployed addresses to:", outputPath);
