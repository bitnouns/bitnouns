import { getProposalThreshold } from '@/data/nouns-builder/governor'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

const handler = async (req: NextRequest) => {
  console.log(req.url)
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address') as string
  const data = await getProposalThreshold({ address })

  return new Response(data.toString(), {
    status: 200,
  })
}

export default handler
