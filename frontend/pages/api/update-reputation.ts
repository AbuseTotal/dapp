import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import ReputationContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, submittedAdress = process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS } = req.body;

  const web3 = new Web3('http://localhost:8545');

  const bountyContract = new web3.eth.Contract(
    ReputationContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_REPUTATION_CONTRACT_ADDRESS,
  );

  bountyContract.methods
    .claimBounty(submittedAdress, userId)
    .send({ from: process.env.NEXT_PUBLIC_OWNER });

  res.status(200).send({});
}
