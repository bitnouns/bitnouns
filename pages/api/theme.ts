import { NextApiRequest, NextApiResponse } from "next";
import { theme } from "theme.config";

export const config = {
  runtime: 'edge',
}

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.send(theme);
};

export default handler;
