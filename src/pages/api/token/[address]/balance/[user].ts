import { getBalanceOf } from '@/data/nouns-builder/token'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/scrypt-js*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

export default async function handler(req: NextRequest) {
  console.log(req.url)
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address') as `0x${string}`
  const user = searchParams.get('user') as `0x${string}`

  try {
    const balance = await getBalanceOf({ address, user })

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24
    return new NextResponse(balance.toString(), {
      status: 200,
      headers: {
        'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
