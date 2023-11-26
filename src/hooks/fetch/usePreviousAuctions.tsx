import { PreviousAuction } from '@/services/nouns-builder/auction'
import useSWR from 'swr'

export const usePreviousAuctions = ({
  auctionContract,
}: {
  auctionContract?: string
}) => {
  return useSWR<PreviousAuction[]>(`/api/auction/${auctionContract}/previous`)
}
