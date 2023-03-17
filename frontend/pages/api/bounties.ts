import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import BountyContractAbi from '@/abis/Bounty.json';
import { AbiItem } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const web3 = new Web3('http://localhost:8545');
  // const web3 = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8545'))

  const bountyAbi = BountyContractAbi as AbiItem[];

  const bountyContractInstance = new web3.eth.Contract(
    BountyContractAbi as AbiItem[],
    process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS,
  );

  const bountiesEvents = await bountyContractInstance.getPastEvents('BountyClaimed', {
    fromBlock: '0',
  });

//   bountiesEvents.on('data', function (event: any) {
//     console.log(JSON.stringify(event));
//   });

  // const subscribe = web3.eth.subscribe('logs', {}, (err, res) => {})

  // subscribe.on('data', (txLog) => console.log(txLog))

  res.status(200).send(bountiesEvents);
}
