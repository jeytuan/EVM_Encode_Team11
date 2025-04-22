import { ethers } from "hardhat";
import { expect } from "chai";
import { Pool } from "../typechain-types";

describe("Pool Contract", () => {
  let pool: Pool;
  let creator: any;
  let user1: any;
  let user2: any;

  const goal = ethers.parseEther("1.0");

  beforeEach(async () => {
    [creator, user1, user2] = await ethers.getSigners();
    const PoolFactory = await ethers.getContractFactory("Pool");
    pool = await PoolFactory.deploy(
      creator.address,
      goal,
      7,
      ethers.parseEther("0.1"), // minContribution
      "Charity",
      "Demo",
      "Desc",
      "public" // ✅ new visibility arg
    );
    await pool.waitForDeployment();
  });

  it("should reject withdrawal by non-creator", async () => {
    await expect(pool.connect(user1).withdraw()).to.be.revertedWith("Only creator can withdraw");
  });

  it("should accept ETH contributions and track user balances", async () => {
    const contribution = ethers.parseEther("0.5");

    await pool.connect(user1).contribute({ value: contribution });

    const userContribution = await pool.connect(user1).getMyContribution();
    expect(userContribution).to.equal(contribution);

    const totalBalance = await pool.getTotalBalance();
    expect(totalBalance).to.equal(contribution);
  });

  it("should handle multiple contributors correctly", async () => {
    const contribution1 = ethers.parseEther("0.3");
    const contribution2 = ethers.parseEther("0.7");

    await pool.connect(user1).contribute({ value: contribution1 });
    await pool.connect(user2).contribute({ value: contribution2 });

    const balance1 = await pool.connect(user1).getMyContribution();
    const balance2 = await pool.connect(user2).getMyContribution();
    const totalBalance = await pool.getTotalBalance();

    expect(balance1).to.equal(contribution1);
    expect(balance2).to.equal(contribution2);
    expect(totalBalance).to.equal(contribution1 + contribution2);
  });

  it("should allow creator to withdraw after reaching goal", async () => {
    const contribution = ethers.parseEther("1.0");
    await pool.connect(user1).contribute({ value: contribution });

    const before = await ethers.provider.getBalance(creator.address);
    const tx = await pool.connect(creator).withdraw();
    const receipt = await tx.wait();

    const gasCost = receipt!.gasUsed * (tx.gasPrice ?? 0n);
    const after = await ethers.provider.getBalance(creator.address);

    expect(after + gasCost).to.be.closeTo(before + contribution, ethers.parseEther("0.01"));
  });

  it("should not allow withdraw twice", async () => {
    await pool.connect(user1).contribute({ value: ethers.parseEther("1.0") });
    await pool.connect(creator).withdraw();

    await expect(pool.connect(creator).withdraw()).to.be.revertedWith("Already withdrawn");
  });

  it("should store name, description, category, and creator", async () => {
    expect(await pool.name()).to.equal("Demo");
    expect(await pool.description()).to.equal("Desc");
    expect(await pool.category()).to.equal("Charity");
    expect(await pool.creator()).to.equal(creator.address);
    expect(await pool.visibility()).to.equal("public"); // ✅ test visibility too
  });
});
