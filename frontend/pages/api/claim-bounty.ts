import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import BountyContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, submittedAdress } = req.body;

  const address =
    submittedAdress ?? '0xe9ff693c5c7ab05ec827330e5cb0555733eac166ca7ca4cdd96f8f06fd7d3ae0';

  const web3 = new Web3('http://localhost:8545');

  console.log('IS ADDRESS: ', web3.utils.isAddress(address));

  const bountyContract = new web3.eth.Contract(
    BountyContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS,
  );

  console.log('IS ADDRESS: ', web3.utils.isAddress(address));

  bountyContract.methods.claimBounty(address, userId).send({ from: process.env.NEXT_PUBLIC_OWNER });

  res.status(200).send({});
}
