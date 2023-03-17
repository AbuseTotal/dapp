import { expect } from "chai";
import { ethers } from "hardhat";
import { Submission } from "../typechain-types/contracts/Submission";
import { Bounty } from "../typechain-types/contracts/Bounty";
import { Reputation } from "../typechain-types/contracts/Reputation";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Submission", function () {
  let submission: Submission;
  let bounty: Bounty;
  let reputation: Reputation;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const BountyFactory = await ethers.getContractFactory("Bounty");
    bounty = (await BountyFactory.deploy()) as Bounty;
    await bounty.deployed();

    const ReputationFactory = await ethers.getContractFactory("Reputation");
    reputation = (await ReputationFactory.deploy()) as Reputation;
    await reputation.deployed();

    const SubmissionFactory = await ethers.getContractFactory("Submission");
    submission = (await SubmissionFactory.deploy(
      bounty.address,
      reputation.address
    )) as Submission;
    await submission.deployed();

    // Transfer ownership of Bounty and Reputation contracts to the Submission contract
    await bounty.transferOwnership(submission.address);
    await reputation.transferOwnership(submission.address);
  });

  it("Should submit a URL correctly", async () => {
    const url = "https://malware.xyz";
    await submission.connect(addr1).submitURL(url);
    const report = await submission.submissions(0);

    expect(report.reporter).to.equal(addr1.address);
    expect(report.url).to.equal(url);
    expect(report.reviewed).to.be.false;
  });

  it("Should review a submission correctly", async function () {
    const url = "https://malware.xyz";
    await submission.connect(addr1).submitURL(url);

    const bountyAmount = ethers.utils.parseUnits("1000", 18);
    const reputationAmount = ethers.utils.parseUnits("1000", 18);

    const previousReputation = await reputation.balanceOf(addr1.address);
    await submission
      .connect(owner)
      .reviewSubmission(0, bountyAmount, reputationAmount);

    const submissionInfo = await submission.submissions(0);
    expect(submissionInfo.reviewed).to.equal(true);

    const updatedReputation = await reputation.balanceOf(addr1.address);
    expect(updatedReputation.sub(previousReputation)).to.equal(
      reputationAmount
    );
  });

  it("Should revert when trying to review an already reviewed submission", async () => {
    const url = "https://malware.xyz";
    await submission.submitURL(url);
    await submission.reviewSubmission(0, 1000, 50);

    await expect(submission.reviewSubmission(0, 500, 25)).to.be.revertedWith(
      "Submission: submission already reviewed"
    );
  });

  it("Should revert when trying to review an invalid submission ID", async () => {
    await expect(submission.reviewSubmission(0, 1000, 50)).to.be.revertedWith(
      "Submission: invalid submission ID"
    );
  });
});
