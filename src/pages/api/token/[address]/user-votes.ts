import { getUserVotes } from '@/data/nouns-builder/token'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  const user = searchParams.get('user')
  const timestamp = searchParams.get('timestamp')

  const data = await getUserVotes({
    address: address as `0x${string}`,
    user: user as `0x${string}`,
    timestamp: timestamp ? (timestamp as string) : undefined,
  })

  return new Response(data.toString(), {
    status: 200,
  })
}

export default handler
