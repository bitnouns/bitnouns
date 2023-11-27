import { getProposalThreshold } from '@/data/nouns-builder/governor'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'nodejs',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query
  const data = await getProposalThreshold({
    address: address as string,
  })

  res.status(200).send(data.toNumber())
}

export default handler
