import { usePreviousAuctions } from '@/hooks/fetch/usePreviousAuctions'
import { useTheme } from '@/hooks/useTheme'
import { AuctionInfo } from '@/services/nouns-builder/auction'
import { ContractInfo } from '@/services/nouns-builder/token'
import { compareAddress } from '@/utils/compareAddress'
import { shortenAddress } from '@/utils/shortenAddress'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import { BigNumber, ethers, utils } from 'ethers'
import { useContractInfo, useCurrentAuctionInfo, useTokenInfo } from 'hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useEnsName } from 'wagmi'
import { CountdownDisplay } from '../CountdownDisplay'
import UserAvatar from '../UserAvatar'
import { HighestBidder } from './HighestBidder'
import { PlaceBid } from './PlaceBid'
import { SettleAuction } from './SettleAuction'

export default function Hero() {
  const { data: contractInfo } = useContractInfo()
  const { data: auctionInfo } = useCurrentAuctionInfo({
    auctionContract: contractInfo?.auction,
  })
  const { query, push } = useRouter()

  const currentTokenId = auctionInfo ? auctionInfo?.tokenId : ''

  const tokenId = query.tokenid
    ? BigNumber.from(query.tokenid as string).toHexString()
    : currentTokenId

  const { data: tokenInfo } = useTokenInfo({ tokenId })
  const [imageLoaded, setImageLoaded] = useState(false)

  const pageBack = () => {
    const bnTokenId = BigNumber.from(tokenId)
    if (bnTokenId.eq(0)) return
    setImageLoaded(false)
    push(`/token/${bnTokenId.sub(1).toNumber()}`, undefined, {
      shallow: true,
    })
  }

  const pageForward = () => {
    const bnTokenId = BigNumber.from(tokenId)
    if (bnTokenId.eq(currentTokenId)) return
    push(`/token/${bnTokenId.add(1).toNumber()}`, undefined, {
      shallow: true,
    })
  }

  return (
    <div className="items-top relative z-20 flex flex-col bg-skin-fill lg:h-[80vh] lg:max-h-[600px] lg:flex-row lg:pt-10">
      <div className="min-h-auto lg:min-h-auto justify-baseline relative mx-4 flex min-h-[350px] flex-col items-end lg:w-1/2 lg:pr-12">
        {tokenInfo && (
          <div className="flex h-auto w-full items-center justify-around">
            <Image
              src={tokenInfo.image}
              unoptimized
              onLoad={() => setImageLoaded(true)}
              height={450}
              width={450}
              alt="logo"
              className={`w-100 h-100 relative z-20 rounded-md lg:h-[65vh] lg:max-h-[500px] ${
                imageLoaded ? 'visible' : 'invisible'
              }`}
            />
          </div>
        )}
        <div
          className={`absolute right-0 top-0 hidden h-[450px] w-[450px] items-center justify-around lg:flex lg:pr-12 ${
            imageLoaded ? 'invisible' : 'visible'
          }`}
        >
          <Image src={'/spinner.svg'} alt="spinner" width={30} height={30} />
        </div>
      </div>
      <div className="min-h-64 mt-6 flex w-screen flex-col items-stretch justify-stretch px-4 lg:mt-0 lg:h-full lg:w-auto">
        <div className="mb-4 flex items-center">
          <button
            onClick={pageBack}
            className={`flex items-center ${
              tokenId === '0x00'
                ? 'border border-skin-stroke'
                : 'bg-skin-backdrop'
            } mr-4 rounded-full p-2`}
          >
            <ArrowLeftIcon
              className={`h-4 ${
                tokenId === '0x00' ? 'text-skin-muted' : 'text-skin-base'
              }`}
            />
          </button>
          <button
            onClick={pageForward}
            className={`flex items-center ${
              tokenId === currentTokenId
                ? 'border border-skin-stroke'
                : 'bg-skin-backdrop'
            } mr-4 rounded-full p-2`}
          >
            <ArrowRightIcon
              className={`h-4 ${
                tokenId === currentTokenId
                  ? 'text-skin-muted'
                  : 'text-skin-base'
              }`}
            />
          </button>
        </div>

        <div className="font-heading text-4xl font-semibold text-skin-base sm:text-6xl">
          {tokenInfo?.name || '---'}
        </div>

        {tokenId === currentTokenId ? (
          <CurrentAuction
            auctionInfo={auctionInfo}
            contractInfo={contractInfo}
            tokenId={currentTokenId}
          />
        ) : (
          <EndedAuction
            auctionContract={contractInfo?.auction}
            tokenId={tokenId}
            owner={tokenInfo?.owner}
          />
        )}
      </div>
    </div>
  )
}

const EndedAuction = ({
  auctionContract,
  tokenId,
  owner,
}: {
  auctionContract?: string
  tokenId?: string
  owner?: `0x${string}`
}) => {
  const { data } = usePreviousAuctions({ auctionContract })
  const auctionData = data?.find((auction) =>
    compareAddress(auction.tokenId, tokenId || ''),
  )

  const { data: ensName } = useEnsName({
    address: owner,
  })

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 pb-8 lg:w-96 lg:grid-cols-2 lg:gap-12 lg:pb-0">
      <div className="mr-8 border-skin-stroke lg:mr-0 lg:border-r">
        <div className="text-lg text-skin-muted">{'Winning Bid'}</div>
        {auctionData ? (
          <div className="mt-2 text-2xl font-semibold text-skin-base sm:text-3xl">
            Ξ {utils.formatEther(auctionData.amount || '0')}
          </div>
        ) : (
          <div className="mt-2 text-2xl font-semibold text-skin-base sm:text-3xl">
            n/a
          </div>
        )}
      </div>
      <div className="lg:w-64">
        <div className="text-lg text-skin-muted">{'Held by'}</div>

        <div className="mt-2 flex items-center">
          <UserAvatar
            diameter={32}
            className="mr-2 h-8 w-8 rounded-full"
            address={owner || ethers.constants.AddressZero}
          />
          <div className="text-xl font-semibold text-skin-base sm:text-3xl">
            {ensName || shortenAddress(owner || ethers.constants.AddressZero)}
          </div>
        </div>
      </div>
    </div>
  )
}

const CurrentAuction = ({
  auctionInfo,
  contractInfo,
  tokenId,
}: {
  auctionInfo?: AuctionInfo
  contractInfo?: ContractInfo
  tokenId: string
}) => {
  const [theme] = useTheme()

  return (
    <Fragment>
      <div className="mt-10 grid grid-cols-2 gap-12 lg:w-96">
        <div className="border-r border-skin-stroke">
          <div className="text-lg text-skin-muted">
            {theme.strings.currentBid || 'Current Bid'}
          </div>
          {auctionInfo && (
            <div className="mt-2 text-2xl font-semibold text-skin-base sm:text-3xl">
              Ξ {utils.formatEther(auctionInfo.highestBid || '0')}
            </div>
          )}
        </div>
        <div className="lg:w-64">
          <div className="text-lg text-skin-muted">
            {theme.strings.auctionEndsIn || 'Auction ends in'}
          </div>
          {auctionInfo && (
            <div className="mt-2 text-2xl font-semibold text-skin-base sm:text-3xl">
              <CountdownDisplay to={auctionInfo.endTime || '0'} />
            </div>
          )}
        </div>
      </div>

      {(auctionInfo?.endTime || 0) < Math.round(Date.now() / 1000) ? (
        <SettleAuction auction={contractInfo?.auction} />
      ) : (
        <PlaceBid
          highestBid={auctionInfo?.highestBid || '0'}
          auction={contractInfo?.auction}
          tokenId={tokenId}
        />
      )}

      {auctionInfo?.highestBidder &&
        !compareAddress(
          auctionInfo?.highestBidder,
          ethers.constants.AddressZero,
        ) && <HighestBidder address={auctionInfo?.highestBidder} />}
    </Fragment>
  )
}
