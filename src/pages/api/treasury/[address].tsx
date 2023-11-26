import DefaultProvider from '@/utils/DefaultProvider'
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

  // Check if address is null or undefined
  if (!address) {
    return new Response('Address not provided', { status: 400 })
  }

  try {
    const treasuryBalance = await DefaultProvider.getBalance(address)

    const ONE_DAY_IN_SECONDS = 60 * 60 * 24
    return new Response(treasuryBalance.toString(), {
      status: 200,
      headers: {
        'Cache-Control': `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Server error', { status: 500 })
  }
}
