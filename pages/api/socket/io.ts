import type { NextApiRequest, NextApiResponse } from "next";
import { getSocketServer } from "@/lib/socket/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  getSocketServer(res);
  res.end();
}

