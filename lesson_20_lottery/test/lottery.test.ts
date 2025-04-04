import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";


describe("Lottery DApp", function () {
  let accounts: any[];
  let lottery: any;
  let token: any;

  const BET_PRICE = parseEther("1");
  const BET_FEE = parseEther("0.2");
  const TOKEN_RATIO = 1n;

  before(async () => {
    accounts = await viem.getWalletClients();
    const deployer = accounts[0];

    const contract = await viem.deployContract("Lottery", [
      "LotteryToken",
      "LT0",
      TOKEN_RATIO,
      BET_PRICE,
      BET_FEE,
    ]);
    lottery = contract;

    const tokenAddress = await contract.read.paymentToken();
    token = await viem.getContractAt("LotteryToken", tokenAddress as `0x${string}`);
  });

  it("should mint tokens for players", async () => {
    const tx = await lottery.write.purchaseTokens({
      value: parseEther("5"),
      account: accounts[1].account,
    });
    const publicClient = await viem.getPublicClient();
    await publicClient.getTransactionReceipt({ hash: tx });

    const balance = await token.read.balanceOf([
      accounts[1].account.address as `0x${string}`,
    ]);
    expect(balance).to.equal(parseEther("5"));
  });

  it("should allow betting and pick a winner", async () => {
    const openTx = await lottery.write.openBets([
      BigInt(Math.floor(Date.now() / 1000)) + 60n,
    ]);
    const publicClient = await viem.getPublicClient();
    await publicClient.getTransactionReceipt({ hash: openTx });

    // 🪙 Mint tokens for both players
    for (let i = 1; i <= 2; i++) {
      const mintTx = await lottery.write.purchaseTokens({
        value: parseEther("5"),
        account: accounts[i].account,
      });
      await publicClient.getTransactionReceipt({ hash: mintTx });
    }

    // ✅ Approve and place bets
    for (let i = 1; i <= 2; i++) {
      await token.write.approve([lottery.address, parseEther("3")], {
        account: accounts[i].account,
      });

      const betTx = await lottery.write.betMany([2n], {
        account: accounts[i].account,
      });
      await publicClient.getTransactionReceipt({ hash: betTx });
    }

    await time.increase(120); // Increase time by 2 minutes (120 seconds)
    await mine(1); // Then mine a block to apply the time    

    const closeTx = await lottery.write.closeLottery();
    await publicClient.getTransactionReceipt({ hash: closeTx });

    const prize1 = await lottery.read.prize([
      accounts[1].account.address as `0x${string}`,
    ]);
    const prize2 = await lottery.read.prize([
      accounts[2].account.address as `0x${string}`,
    ]);
    const winner =
      prize1 > 0n
        ? accounts[1].account.address
        : prize2 > 0n
        ? accounts[2].account.address
        : null;

    expect(winner).to.not.be.null;
    console.log(`🏆 Winner: ${winner}`);
  });

  it("should allow winner to claim prize", async () => {
    const publicClient = await viem.getPublicClient();

    const winnerIndex =
      (await lottery.read.prize([
        accounts[1].account.address as `0x${string}`,
      ])) > 0n
        ? 1
        : 2;

    const prizeAmount = await lottery.read.prize([
      accounts[winnerIndex].account.address as `0x${string}`,
    ]);

    if (prizeAmount > 0n) {
      const claimTx = await lottery.write.prizeWithdraw([prizeAmount], {
        account: accounts[winnerIndex].account,
      });
      await publicClient.getTransactionReceipt({ hash: claimTx });

      const balance = await token.read.balanceOf([
        accounts[winnerIndex].account.address as `0x${string}`,
      ]);
      console.log(
        `🎉 Final token balance for winner: ${formatEther(balance)} LT0`
      );
      expect(balance).to.be.greaterThan(0n);
    } else {
      console.log("❌ No prize to withdraw");
    }
  });
});
