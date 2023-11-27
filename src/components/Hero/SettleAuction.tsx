import { AuctionABI } from '@buildersdk/sdk'
import Image from 'next/image'
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export const SettleAuction = ({ auction }: { auction?: string }) => {
  const { config } = usePrepareContractWrite({
    address: auction as Address,
    abi: AuctionABI,
    functionName: 'settleCurrentAndCreateNewAuction',
    enabled: !!auction,
  })
  const { write, data, isLoading: contractLoading } = useContractWrite(config)
  const { isLoading: transactionLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const isLoading = contractLoading || transactionLoading

  return (
    <button
      onClick={() => write?.()}
      className="mt-6 flex h-12 w-full items-center justify-around rounded-lg bg-skin-button-accent text-skin-inverted hover:bg-skin-button-accent-hover"
    >
      {isLoading ? (
        <Image src="/spinner.svg" height={26} width={26} alt="spinner" />
      ) : (
        <span>Settle Auction</span>
      )}
    </button>
  )
}
