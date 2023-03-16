import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("Submission", function () {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const Submission = await ethers.getContractFactory("Submission");
    const submission = await Submission.deploy();

    return { owner, otherAccount, submission };
  };

  it("should submit a URL, update reports and reporter balance", async function () {
    
    const url = "https://example.com";
    const { owner, otherAccount, submission } = await deployContract();

    const initialBalanceWei = await submission.getReputation(otherAccount.address);
    const { hash } = await submission.connect(otherAccount).submitUrl(url);

    const updatedbalanceWei = await submission.getReputation(otherAccount.address);
    const report = await submission.getReport(url);

    expect(report).to.exist;
    expect(report).contains(otherAccount.address);
    expect(Number(updatedbalanceWei)).to.be.greaterThan(
      Number(initialBalanceWei)
    );
  });
});
