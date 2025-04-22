# 🧾 Week 3 Report — Encode EVM Bootcamp

## ✅ Overview

This week, we successfully deployed and interacted with the `TokenizedBallot.sol` contract using Hardhat + Viem + TypeScript on the Sepolia testnet. The goal was to simulate a decentralized voting process, including token distribution, voting rights delegation, and vote casting.

---

## 🔧 Key Achievements

- ✅ Migrated from Hardhat’s default Ethers setup to **Viem** + **TypeScript**.
- ✅ Resolved ABI & Bytecode typing issues using `deployContract`.
- ✅ Implemented our own `toBytes32Str` utility using `stringToBytes`.
- ✅ Used `getAddress()` from `viem` to fix checksum mismatch issues.
- ✅ Deployed `TokenizedBallot` to Sepolia with correct constructor args.

---

## 📝 Deployment Logs


 npx hardhat run scripts/deployTokenizedBallot.ts --network sepolia
✅ TokenizedBallot deployed to: 0x5b0f95c3e87c088cecb02aac064c899cbef95efa97710d6ca98e3794d925e4d4
---

## 📬 Address Normalization
 npx tsx -e "import { getAddress } from 'viem'; console.log(getAddress('0x985c95f2429bdd9cfa2ee94f921865a55de0e4df'))"
🆗 Normalized Address: 0x985c95f2429Bdd9cFA2EE94f921865a55DE0e4dF

## 🧪 Voting Test Cases
1. Vote Already Cast
npx hardhat run scripts/CastVote.ts --network sepolia
❌ Cast vote script failed: ContractFunctionExecutionError: The contract function "vote" reverted with reason:
Already voted.
    - Contract: 0xb5bF0eea960Df5783bF85093d8dc654Daf62aE36
    - Sender: 0xbbbfa6de552944997feb5a2d5a382fe11eaddd3a

2. Cast Vote (Success)
npx hardhat run scripts/CastVote.ts --network sepolia
✅ Vote cast for proposal 0. Tx hash: 0x9d969f0888ac221e4c033738397c7b82c07037c04b4e95c1b930e22e2481e5e1


## Voting Rights Granted:

npx hardhat run scripts/GiveVotingRights.ts --network sepolia
✅ Voting rights granted to 0xe2A95ebE3EbBb1857C833d289Ca7be38BA5f26E7
📜 Tx hash: 0xb829413b89bd6659f25647a44bc75b64504bce2a012bef8d772605a93c7adf11

npx hardhat run scripts/GiveVotingRights.ts --network sepolia
✅ Voting rights granted to 0x6ccF09a6bA32713b93f27d0B4AAB781Daf98a7Ad
📜 Tx hash: 0x152d40f88396ea9472dd114442dc92f4c8c82e8c427a638e4dab375faaddd4c8

## 🔗 Delegation
npx hardhat run scripts/DelegateVotes.ts --network sepolia
✅ Vote delegated to 0x71bE63f3384f5fb98995898A86B02Fb2426c5788
📜 Tx hash: 0x858864944ea4533aa76b37083f2bae9255b3a2a53887dc09583571549149a0b0


## 📊 Voter State Query
npx hardhat run scripts/QueryVoterState.ts --network sepolia
🔎 Voter Data:
Weight   : 1
Voted    : True
Delegate : 0x71bE63f3384f5fb98995898A86B02Fb2426c5788
Vote     : 0


## 🔁 Issues Resolved
- Recompiled artifacts to fix missing TokenizedBallot output
- Typechain output switched from viem to ethers-v6 after registry errors
- encodeBytes32String and bytesToString adjusted from viem/utils
- Fixed getContract() type errors using as Address and proper ABI typing

# ✅ Summary
This week was all about mastering the real-world DevOps of deploying and interacting with EVM smart contracts using Viem and Hardhat in TypeScript. By resolving type conflicts, formatting addresses correctly, and deploying scripts with real Sepolia transactions, we simulated a real DAO voting workflow successfully!