import type { NextApiRequest, NextApiResponse } from "next";
import { zkConnectVerify } from "@/services";

const providersStore: any = new Map()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { zkConnectResponse } = req.body;

  try {
    const vaultId = await zkConnectVerify(zkConnectResponse);

    providersStore.set(vaultId, {
      email: 'example@mail.com'
    })

    res.status(200).json({ status: "provider connected", vaultId });
  } catch (e: any) {
    res.status(400).json({ status: "error", message: e.message });
  }
}