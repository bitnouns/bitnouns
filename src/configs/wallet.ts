import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { zora, zoraTestnet } from '@wagmi/chains'
import { configureChains, createClient, goerli, mainnet } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const network = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_TOKEN_NETWORK || '1';
const alchemyKey = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_KEY || '';

const selectedChain = {
  '1': mainnet,
  '5': goerli,
  '999': zoraTestnet,
  '7777777': zora,
}[network]!

export const RPC_URL = {
  '1': `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  '5': `https://eth-goerli.g.alchemy.com/v2/${alchemyKey}`,
  '999': 'https://testnet.rpc.zora.energy',
  '7777777': 'https://rpc.zora.energy',
}[network]!

export type ChainId = '1' | '5' | '999' | '7777777'

const { chains, provider } = configureChains(
  [selectedChain],
  [
    jsonRpcProvider({
      rpc: (_) => {
        return { http: RPC_URL }
      },
      stallTimeout: 1000,
    }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
  projectId: '12fcc83f53d043bf4282e8233ef1aad7',
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export { chains, wagmiClient }
