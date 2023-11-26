import { getUserVotes } from '@/data/nouns-builder/token'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

export default async function handler(req: NextRequest) {
  console.log(req.url)
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address') as `0x${string}`
  const user = searchParams.get('user') as `0x${string}`
  const timestamp = searchParams.get('timestamp')
    ? (searchParams.get('timestamp') as string)
    : undefined

  // Check if address is null or undefined
  if (!address) {
    return new Response('Address not provided', { status: 400 })
  }

  const data = await getUserVotes({ address, user, timestamp })

  return new Response(data.toString(), {
    status: 200,
  })
}
