import { getUserVotes } from '@/data/nouns-builder/token'
import { NextRequest, NextResponse } from 'next/server'

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

  try {
    const data = await getUserVotes({ address, user, timestamp })

    return new NextResponse(data.toString(), {
      status: 200,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
