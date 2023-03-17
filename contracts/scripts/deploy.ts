import { ethers } from "hardhat";

async function main() {
  const Bounty = await ethers.getContractFactory("Bounty");
  const bounty = await Bounty.deploy()
  await bounty.deployed();

  const Reputation = await ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy()
  await reputation.deployed();

  const Submission = await ethers.getContractFactory("Submission");
  const submission = await Submission.deploy(bounty.address, reputation.address);
  await submission.deployed();

  console.log(`Bounty: ${bounty.address}`);
  console.log(`Reputation: ${reputation.address}`);
  console.log(`Submission: ${submission.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
