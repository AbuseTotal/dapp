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

  const userId = "0x12299cf17bce646d304b722dd2d11f2e843d763072c1be711f54b73bdbf69862"

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
      bounty.connect(addr1).submitBounty(1000, userId)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert when a non-owner tries to claim a bounty", async function () {
    await bounty.submitBounty(1000, userId);
    await expect(
      bounty.connect(addr2).claimBounty(addr1.address, userId)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // it("Should distribute multiple bounties correctly", async function () {
  //   await bounty.submitBounty(addr1.address, 1000, userId);
  //   await bounty.submitBounty(addr2.address, 2000, userId);

  //   await bounty.connect(addr1).claimBounty(addr1.address, userId);
  //   await bounty.connect(addr2).claimBounty(addr2.address, userId);

  //   const addr1Balance = await bounty.balanceOf(addr1.address);
  //   const addr2Balance = await bounty.balanceOf(addr2.address);

  //   expect(addr1Balance).to.equal(1000);
  //   expect(addr2Balance).to.equal(2000);
  // });

  it("Should revert when claiming an invalid bounty", async function () {
    await expect(bounty.claimBounty(addr1.address, userId)).to.be.revertedWith(
      "Bounty: no bounty available for the specified address"
    );
  });
});
