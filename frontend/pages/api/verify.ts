import type { NextApiRequest, NextApiResponse } from "next";
import { zkConnectVerify } from "@/services";

const userStore: any = new Map()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("response: ", req.body);
  const { zkConnectResponse } = req.body;

  try {
    const vaultId = await zkConnectVerify(zkConnectResponse);
    // console.log("vaultId", vaultId);

    userStore.set(vaultId, {
      email: 'example@mail.com'
    })

    res.status(200).json({ status: "not-subscribed", vaultId });
  } catch (e: any) {
    res.status(400).json({ status: "error", message: e.message });
  }
}