import { useDebounce } from '@/hooks/useDebounce'
import { useTheme } from '@/hooks/useTheme'
import { AuctionABI } from '@buildersdk/sdk'
import { BigNumber, utils } from 'ethers'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export const PlaceBid = ({
  highestBid,
  auction,
  tokenId,
}: {
  highestBid?: string
  auction?: string
  tokenId?: string
}) => {
  const { address } = useAccount()
  const [bid, setBid] = useState('')
  const debouncedBid = useDebounce(bid, 500)
  const [theme] = useTheme()

  const { config, error } = usePrepareContractWrite({
    address: auction,
    abi: AuctionABI,
    functionName: 'createBid',
    args: [BigNumber.from(tokenId || 1)],
    overrides: {
      value: utils.parseEther(debouncedBid || '0'),
    },
    enabled: !!auction && !!debouncedBid,
  })
  const { write, data } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const highestBidBN = BigNumber.from(highestBid)
  const amountIncrease = highestBidBN.div('10')
  const nextBidAmount = highestBidBN.add(amountIncrease)

  const getError = () => {
    if (!error?.message) return
    const message = error?.message

    if (message.includes('insufficient funds'))
      return 'Error insufficent funds for bid'

    if (debouncedBid && debouncedBid < utils.formatEther(nextBidAmount))
      return 'Error invalid bid'
  }

  return (
    <Fragment>
      <div className="mt-12 flex flex-col sm:mt-6 sm:flex-row">
        <input
          value={bid}
          type="number"
          onChange={(e) => setBid(e.target.value)}
          className="mr-2 w-full rounded-lg bg-skin-backdrop p-3 text-2xl text-skin-base placeholder:text-skin-muted focus:outline-none"
          placeholder={
            nextBidAmount ? `Ξ ${utils.formatEther(nextBidAmount)} or more` : ''
          }
        />
        <button
          disabled={!write}
          onClick={(e) => {
            e.preventDefault()
            write?.()
          }}
          className={`bg-skin-button-accent ${
            address
              ? write
                ? 'bg-skin-button-accent transition ease-in-out hover:scale-110'
                : 'bg-skin-button-accent hover:bg-skin-button-accent-hover'
              : 'bg-skin-button-muted'
          } mt-4 flex h-12 w-full items-center justify-around rounded-lg text-xl text-skin-inverted sm:mt-0 sm:h-auto sm:w-40`}
        >
          {isLoading ? (
            <Image src="/spinner.svg" height={24} width={24} alt="spinner" />
          ) : (
            <span>{theme.strings.placeBid || 'Place bid'}</span>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-5 h-auto w-96 break-words text-center text-red-500">
          {getError()}
        </p>
      )}
    </Fragment>
  )
}
