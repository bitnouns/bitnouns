import {
  getCurrentAuction,
  getPreviousAuctions,
} from '@/data/nouns-builder/auction'
import {
  getProposalThreshold,
  getProposals,
} from '@/data/nouns-builder/governor'
import { getAddresses } from '@/data/nouns-builder/manager'
import {
  getBalanceOf,
  getContractInfo,
  getTokenInfo,
  getUserVotes,
} from '@/data/nouns-builder/token'
import DefaultProvider from '@/utils/DefaultProvider'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { theme } from '../../../theme.config'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/.pnpm/**/node_modules/lodash*/*.js',
    '**/.pnpm/**/node_modules/scrypt-js*/*.js',
    '**/.pnpm/**/node_modules/@walletconnect*/**/*.js',
  ],
}

const app = new Hono().basePath('/api')

app.get('/auction/:address', async (c) => {
  const address = c.req.param('address')

  const auctionInfo = await getCurrentAuction({ address: address as string })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(auctionInfo)
})

app.get('/auction/:address/previous', async (c) => {
  const address = c.req.param('address')

  const previousAuctions = await getPreviousAuctions({
    address: address as string,
  })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(previousAuctions)
})

app.get('/governor/:address/current-threshold', async (c) => {
  const address = c.req.param('address')

  const data = await getProposalThreshold({
    address: address as string,
  })

  return c.text(data.toString())
})

app.get('/governor/:address/proposals', async (c) => {
  const address = c.req.param('address')

  const proposals = await getProposals({ address: address as `0x${string}` })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24

  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(proposals)
})

app.get('/manager/addresses/:address', async (c) => {
  const address = c.req.param('address')

  const daoAddresses = await getAddresses({
    tokenAddress: address as `0x${string}`,
  })
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(daoAddresses)
})

app.get('/token/:address', async (c) => {
  const address = c.req.param('address')

  const contractInfo = await getContractInfo({ address: address as string })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(contractInfo)
})

app.get('/token/:address/:tokenid', async (c) => {
  const address = c.req.param('address')
  const tokenid = c.req.param('tokenid')

  const tokenInfo = await getTokenInfo({
    address: address as string,
    tokenid: tokenid as string,
  })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(tokenInfo)
})

app.get('/token/:address/governor', async (c) => {
  const address = c.req.param('address')

  const contractInfo = await getContractInfo({ address: address as string })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )
  return c.json(contractInfo)
})

app.get('/token/:address/user-votes', async (c) => {
  const address = c.req.param('address')
  const user = c.req.query('user')
  const timestamp = c.req.query('timestamp')

  const data = await getUserVotes({
    address: address as `0x${string}`,
    user: user as `0x${string}`,
    timestamp: timestamp ? (timestamp as string) : undefined,
  })

  return c.text(data.toString())
})

app.get('/token/:address/balance/:user', async (c) => {
  const address = c.req.param('address')
  const user = c.req.query('user')

  const balance = await getBalanceOf({
    address: address as '0x${string}',
    user: user as '0x${string}',
  })

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )

  return c.text(balance.toString())
})

app.get('/treasury/:address', async (c) => {
  const address = c.req.param('address')

  const treasuryBalance = await DefaultProvider.getBalance(address as string)

  const ONE_DAY_IN_SECONDS = 60 * 60 * 24
  c.header(
    'Cache-Control',
    `s-maxage=60, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  )

  return c.json(treasuryBalance)
})

app.get('/theme', async (c) => {
  return c.json(theme)
})

export default handle(app)
