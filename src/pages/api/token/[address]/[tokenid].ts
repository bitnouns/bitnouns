import { TokenInfo, getTokenInfo } from '@/data/nouns-builder/token'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'nodejs',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

type ResponseData = TokenInfo

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { address, tokenid } = req.query
  const tokenInfo = await getTokenInfo({
    address: address as string,
    tokenid: tokenid as string,
  })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  res.setHeader(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  res.send(tokenInfo)
}

export default handler
