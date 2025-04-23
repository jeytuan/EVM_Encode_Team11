# EVM_Bootcamp_Drypto 🚀

This is the monorepo for the Encode Solidity Bootcamp Team 11 final project and related learning tracks. It includes all smart contract lessons, our custom dApp frontend, and the innovative **Drypto** project — a decentralized crowdfunding and NFT experience.

## 📁 Monorepo Structure

```
EVM_Bootcamp_Drypto/
├── evm_bootcamp/     → All Encode lecture exercises and test contracts
├── drypto/           → Our NFT generator + hybrid astrology asset builder
├── my-dapp-ui/       → Scaffold-ETH 2 frontend for the Drypto platform
```

---

## 💡 Project Overview: Drypto

**Drypto** is a decentralized pooling & gifting platform powered by smart contracts. It blends:
- 🧠 **EVM contracts**: Tokenized pools with contribution goals and withdrawal logic
- 🖼️ **NFTs**: Soulbound pets based on a hybrid astrology system
- 🖥️ **Frontend**: Scaffold-ETH 2 + Viem + Wagmi for blazing-fast UX

The project was built for the Encode Solidity Bootcamp and demonstrated on **Demo Day (April 24, 2025 @ 14:00 BST)**.

---

## 📦 Subproject Quickstart

### `evm_bootcamp/`
> Contains all smart contracts, test files, and exercises from bootcamp lessons.

To run:
```bash
cd evm_bootcamp
npm install
npx hardhat test
```

---

### `drypto/`
> Core directory for our Drypto innovations. Includes:
> ✅ Pool + PoolFactory smart contracts (testable via Hardhat)
> ⚠️ NFT generator for the Primal Fusion Astrology system (currently experimental / not functional)

To test smart contracts:
```bash
cd drypto
npx hardhat test
```

To experiment with the NFT generator (WIP):
```bash
cd drypto/nft-generator
python generator.py
```

---

### `my-dapp-ui/`
> Scaffold-ETH 2 frontend that powers the Drypto experience.

To run:
```bash
cd my-dapp-ui/packages/nextjs
npm install
npm run dev
```

---

## 🤝 Contributing

Want to collaborate on the project, refine UI, or expand the NFT logic?

📍 See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines and setup instructions.

---

## 👥 Team 11

Built by:
- Justin ([@jeytuan](https://github.com/jeytuan))
- Sabb
- Raja ([@slraja]https://github.com/slraja)
- Nate

Special thanks to the Encode Bootcamp instructors and mentors!

---

## 🛡️ License

MIT — Free to fork, remix, and build on.
