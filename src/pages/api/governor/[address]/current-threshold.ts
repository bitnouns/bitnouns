import { getProposalThreshold } from '@/data/nouns-builder/governor'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query
  const data = await getProposalThreshold({
    address: address as string,
  })

  console.log('data', data, address)

  res.status(200).send(data.toNumber())
}

export default handler
