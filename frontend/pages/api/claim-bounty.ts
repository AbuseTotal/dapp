import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import BountyContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, submittedAdress } = req.body;

  const web3 = new Web3('http://localhost:8545');

  const bountyAbi = BountyContractAbi as AbiItem[];

  const bountyContract = new web3.eth.Contract(
    BountyContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS,
  );

  console.log(bountyContract.methods)

  bountyContract.methods
    .claimBounty(submittedAdress, userId)
    .call({ from: process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS })//, function (err: any, res: any) {
    //   if (err) {
    //     console.log('An error occurred', err);
    //     return;
    //   }
    //   console.log('Hash of the transaction: ' + res);
    // });

    res.status(200).send({})
}
