import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import BountyContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, submittedAddress = '0x976EA74026E726554dB657fA54763abd0C3a0aa9' } = req.body;

  const web3 = await new Web3('http://localhost:8545');

  const bountyContract = await new web3.eth.Contract(
    BountyContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS,
  );

  await bountyContract.methods
    .claimBounty(submittedAddress, userId)
    .send({ from: process.env.NEXT_PUBLIC_OWNER });

  res.status(200).send({});
}
