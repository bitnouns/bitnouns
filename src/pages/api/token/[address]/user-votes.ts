import { getUserVotes } from '@/data/nouns-builder/token'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'nodejs',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, user, timestamp } = req.query

  const data = await getUserVotes({
    address: address as `0x${string}`,
    user: user as `0x${string}`,
    timestamp: timestamp ? (timestamp as string) : undefined,
  })

  res.status(200).send(data.toNumber())
}

export default handler
