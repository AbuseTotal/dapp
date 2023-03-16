import Web3 from "web3";
import assert from "assert";
import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("Reporting", function () {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const Reporting = await ethers.getContractFactory("Reporting");
    const reporting = await Reporting.deploy();

    return { owner, otherAccount, reporting };
  };

  it("should submit a URL and update reports and reporter balance", async function () {
    const { owner, otherAccount, reporting } = await deployContract();

    const initialBalanceWei = await reporting.getReputation(
      otherAccount.address
    );

    const url = "https://example.com";
    const { hash } = await reporting.connect(otherAccount).submitUrl(url);

    const updatedbalanceWei = await reporting.getReputation(
      otherAccount.address
    );

    const report = await reporting.getReport(url);

    expect(report).to.exist;
    expect(report).contains(otherAccount.address);
    expect(Number(updatedbalanceWei)).to.be.greaterThan(
      Number(initialBalanceWei)
    );
  });
});
