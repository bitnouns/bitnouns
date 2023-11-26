import { useTheme } from '@/hooks/useTheme'
import { shortenAddress } from '@/utils/shortenAddress'
import { Fragment } from 'react'
import { useEnsName } from 'wagmi'
import UserAvatar from '../UserAvatar'

export const HighestBidder = ({ address }: { address?: `0x${string}` }) => {
  const { data: ensName } = useEnsName({ address })
  const [theme] = useTheme()

  if (!address) return <Fragment />

  return (
    <div className="mt-6 flex w-full flex-wrap items-center justify-between border-skin-stroke pb-4 sm:border-b">
      <div className="text-skin-muted">
        {theme.strings.highestBidder || 'Highest Bidder'}
      </div>

      <div className="flex items-center">
        <div className="mt-2 flex items-center">
          <UserAvatar className="mr-2 h-6 rounded-full" address={address} />
          <div className="font-semibold text-skin-base">
            {ensName || shortenAddress(address)}
          </div>
        </div>
      </div>
    </div>
  )
}
