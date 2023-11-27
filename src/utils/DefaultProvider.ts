import { RPC_URL } from '@/configs/wallet'
import { providers } from 'ethers'

const provider = new providers.JsonRpcProvider({
  url: RPC_URL,
  skipFetchSetup: true,
})

export default provider
