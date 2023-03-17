import { expect } from "chai";
import { ethers } from "hardhat";
import { Bounty } from "../typechain-types/contracts/Bounty";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Bounty", function () {
  let bounty: Bounty;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    const BountyFactory = await ethers.getContractFactory("Bounty");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    bounty = (await BountyFactory.deploy()) as Bounty;
  });

  it("Should initialize with correct values", async () => {
    expect(await bounty.name()).to.equal("BountyToken");
    expect(await bounty.symbol()).to.equal("BT");
  });

  it("Should revert when a non-owner tries to submit a bounty", async function () {
    await expect(
      bounty.connect(addr1).submitBounty(addr1.address, 1000)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert when a non-owner tries to claim a bounty", async function () {
    await bounty.submitBounty(addr1.address, 1000);
    await expect(
      bounty.connect(addr2).claimBounty(addr1.address)
    ).to.be.revertedWith("Bounty: caller is not eligible to claim the bounty");
  });

  it("Should distribute multiple bounties correctly", async function () {
    await bounty.submitBounty(addr1.address, 1000);
    await bounty.submitBounty(addr2.address, 2000);

    await bounty.connect(addr1).claimBounty(addr1.address);
    await bounty.connect(addr2).claimBounty(addr2.address);

    const addr1Balance = await bounty.balanceOf(addr1.address);
    const addr2Balance = await bounty.balanceOf(addr2.address);

    expect(addr1Balance).to.equal(1000);
    expect(addr2Balance).to.equal(2000);
  });

  it("Should revert when claiming an invalid bounty", async function () {
    await expect(bounty.claimBounty(addr1.address)).to.be.revertedWith(
      "Bounty: no bounty available for the specified address"
    );
  });
});