# 📦 Lesson Materials – Encode Club EVM Bootcamp

Welcome to the **Team 11 Group Practice Workspace** for the Encode EVM Bootcamp (Q1 2025).  
This directory contains collaborative smart contract assignments, deployment scripts, and test cases as we work through the technical lifecycle of Solidity development.

## 🧠 What’s Inside
- `Ballot.sol`, `TokenizedBallot.sol`: Voting logic and governance lifecycle
- `MyToken.sol`: ERC20 implementation for tokenized voting
- Scripts: Minting tokens, delegating voting power, casting votes, reading results
- Viem + Hardhat integrations for seamless TypeScript execution

## ✅ Highlights from Group Work
- 🧪 Successfully deployed and interacted with `TokenizedBallot` on Sepolia
- 👥 Delegated vote power and verified delegation state changes on-chain
- 🗳️ Cast votes with minted tokens and tracked results by proposal
- 🔍 Used `viem` and `ethers` to read contract state with precision
- 📊 Queried and decoded on-chain bytes32 proposal names from Solidity

## 🛠 Scripts in Action
Each script under `lesson_materials/scripts/` targets a specific stage of the voting process:

| Script | Purpose |
|--------|---------|
| `DeployBallot.ts` | Deploy ballot contracts |
| `GiveVotingRights.ts` | Grant vote rights |
| `DelegateVotes.ts` | Delegate voting power |
| `CastVote.ts` | Submit a vote |
| `QueryVoterState.ts` | View voter state |
| `QueryResults.ts` | List proposal outcomes |
| `interactWithBallot.ts` | Full lifecycle (mint, delegate, vote, read) |

## 📁 Repo Navigation

- `contracts/`: Solidity smart contracts  
- `scripts/`: Hardhat + Viem automation scripts  
- `test/`: Unit testing with TypeScript  
- `.env`: Sensitive keys and config (excluded from repo)

## 🚀 Team Notes

- Deployed on Sepolia Testnet using two distinct wallets
- Used environment-based account management for delegation
- Confirmed all major interactions via transaction hashes
- Everything tracked & version-controlled for submission

---

**Team 11, Encode Club Bootcamp – Stronger together 💪**
