import { IPFS_GATEWAY } from '@/constants/urls'
import getNormalizedURI from '@/utils/getNormalizedURI'
import Image from 'next/image'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useEnsAvatar } from 'wagmi'

export default function UserAvatar({
  address,
  className,
  diameter,
}: {
  address: `0x${string}`
  className: string
  diameter?: number
}) {
  const { data: ensAvatar } = useEnsAvatar({
    address,
  })

  if (!ensAvatar)
    return (
      <div className={className}>
        <Jazzicon diameter={diameter} seed={jsNumberForAddress(address)} />
      </div>
    )

  if (ensAvatar.includes('ipfs'))
    return (
      <Image
        src={getNormalizedURI(ensAvatar, {
          preferredIPFSGateway: IPFS_GATEWAY,
        })}
        className={className}
        alt="avatar"
        height={20}
        width={20}
      />
    )

  return (
    <Image
      alt="avatar"
      src={ensAvatar}
      className={className}
      height={20}
      width={20}
    />
  )
}
