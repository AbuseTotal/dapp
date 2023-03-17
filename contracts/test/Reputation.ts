import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { Reputation } from "../typechain-types/contracts/Reputation";

describe("Reputation", () => {
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let reputation: Reputation;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const ReputationFactory = await ethers.getContractFactory("Reputation");
    reputation = (await ReputationFactory.deploy()) as Reputation;
    await reputation.deployed();
  });

  it("Should initialize with correct values", async () => {
    expect(await reputation.name()).to.equal("ReputationToken");
    expect(await reputation.symbol()).to.equal("RT");
  });

  it("Should allow owner to mint reputation", async () => {
    const user1Address = await user1.getAddress();
    await reputation.mint(user1Address, 100);
    expect(await reputation.balanceOf(user1Address)).to.equal(100);
  });

  it("Should allow owner to burn reputation", async () => {
    const user1Address = await user1.getAddress();
    await reputation.mint(user1Address, 100);
    await reputation.burn(user1Address, 50);
    expect(await reputation.balanceOf(user1Address)).to.equal(50);
  });

  it("Should not allow non-owner to mint reputation", async () => {
    const user1Address = await user1.getAddress();
    const user1Reputation = reputation.connect(user1);
    await expect(user1Reputation.mint(user1Address, 100)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not allow non-owner to burn reputation", async () => {
    const user1Address = await user1.getAddress();
    await reputation.mint(user1Address, 100);
    const user1Reputation = reputation.connect(user1);
    await expect(user1Reputation.burn(user1Address, 50)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not allow transfers", async () => {
    const user1Address = await user1.getAddress();
    const user2Address = await user2.getAddress();

    await reputation.mint(user1Address, 100);
    await expect(reputation.transfer(user2Address, 50)).to.be.revertedWith(
      "Reputation: transfers are disabled"
    );
  });

  it("Should update reputation properly", async () => {
    const user1Address = await user1.getAddress();

    await reputation.updateReputation(user1Address, 100);
    expect(await reputation.balanceOf(user1Address)).to.equal(100);

    await reputation.updateReputation(user1Address, 50);
    expect(await reputation.balanceOf(user1Address)).to.equal(150);
  });

  it("Should emit ReputationUpdated event", async () => {
    const user1Address = await user1.getAddress();

    await expect(reputation.updateReputation(user1Address, 100))
      .to.emit(reputation, "ReputationUpdated")
      .withArgs(user1Address, 100);
  });
});
