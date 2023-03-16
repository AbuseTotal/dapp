import Web3 from "web3";
import assert from "assert";
import { ethers } from "hardhat";
import { expect } from "chai";

describe.only("Reporting", function () {
  it("should submit a URL and update reports and reporter balance", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const Reporting = await ethers.getContractFactory("Reporting");
    const reporting = await Reporting.deploy();

    const initialBalanceWei = await reporting.getReputation(otherAccount.address);

    const url = "https://example.com";
    const { hash } = await reporting.connect(otherAccount).submitUrl(url);

    const reports = await reporting.getReports();

    const updatedbalanceWei = await reporting.getReputation(otherAccount.address);

    console.log("Initial Value", initialBalanceWei);
    console.log("Updated Value", updatedbalanceWei);

    expect(reports.length).to.be.equal(1);
    expect(reports[0]).contains(otherAccount.address).and.contains(url);
    expect(Number(updatedbalanceWei)).to.be.greaterThan(Number(initialBalanceWei));

  });
});
