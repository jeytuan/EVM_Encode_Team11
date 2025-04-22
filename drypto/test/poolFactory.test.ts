import { ethers } from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import type { Log } from "ethers";

describe("PoolFactory", () => {
  let factory: any;
  let deployer: any;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PoolFactory");
    factory = await Factory.deploy();
    await factory.waitForDeployment();
  });

  it("should deploy a new Pool contract", async () => {
    const tx = await factory.createPool(
      ethers.parseEther("1.0"), // goal
      7,                         // duration
      ethers.parseEther("0.1"), // minContribution
      "Charity",                // category
      "Test Pool",              // name
      "Test Description",       // description
      "public"                  // visibility
    );

    // Wait for tx to finish to emit
    const receipt = await tx.wait();

    // Type-safe event decoding
    const event = receipt?.logs.find((log: Log & { fragment?: any; args?: any }) =>
      log.fragment?.name === "PoolCreated"
    );

    expect(event).to.not.be.undefined;
    expect(event?.args.creator).to.equal(deployer.address);
  });

  it("should track pool in allPools array", async () => {
    await factory.createPool(
      ethers.parseEther("1.0"),
      7,
      ethers.parseEther("0.1"),
      "Charity",
      "Pool A",
      "Desc",
      "private"
    );

    const pools = await factory.getAllPools();
    expect(pools.length).to.equal(1);
  });

  it("should track pools per creator", async () => {
    await factory.createPool(
      ethers.parseEther("2.0"),
      5,
      ethers.parseEther("0.2"),
      "Education",
      "My Pool",
      "Desc",
      "public"
    );

    const userPools = await factory.getPoolsByCreator(deployer.address);
    expect(userPools.length).to.equal(1);
  });
});
