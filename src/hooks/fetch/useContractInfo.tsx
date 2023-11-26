import { TOKEN_CONTRACT } from '@/constants/addresses'
import { ContractInfo } from '@/data/nouns-builder/token'
import useSWR from 'swr'

export const useContractInfo = () => {
  return useSWR<ContractInfo>(`/api/token/${TOKEN_CONTRACT}`)
}
