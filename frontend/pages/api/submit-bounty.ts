import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import BountyContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, submittedAdress } = req.body;

  const web3 = new Web3('http://localhost:8545');

  const bountyContract = new web3.eth.Contract(
    BountyContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS,
  );

  const account0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  console.log(bountyContract.methods)

  bountyContract.methods
    .submitBounty(1000, userId)
    .send({ from: account0 })//, function (err: any, res: any) {
    //   if (err) {
    //     console.log('An error occurred', err);
    //     return;
    //   }
    //   console.log('Hash of the transaction: ' + res);
    // });

    res.status(200).send({})
}
