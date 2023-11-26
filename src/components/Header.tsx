import { TOKEN_CONTRACT } from '@/constants/addresses'
import { ETHERSCAN_BASEURL } from '@/constants/urls'
import {
  useContractInfo,
  useDAOAddresses,
  useTheme,
  useTreasuryBalance,
} from '@/hooks'
import { NavigationItem } from '@/types/ThemeConfig/NavigationItem'
import { formatTreasuryBalance } from '@/utils/formatTreasuryBalance'
import { Bars3Icon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, Key, useState } from 'react'
import CustomConnectButton from './CustomConnectButton'
import MobileMenu from './MobileMenu'
import NavigationItemsComponent from './NavigationItem'

export default function Header() {
  const { data: contractInfo } = useContractInfo()
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  })
  const { data: treasury } = useTreasuryBalance({
    treasuryContract: addresses?.treasury,
  })
  const [theme] = useTheme()
  const [showMobile, setShowMobile] = useState(false)

  const onlyTitle = theme.brand.title !== null && theme.brand.logo === null

  return (
    <Fragment>
      <div className="flex w-full items-center justify-between px-6 py-8 xl:w-[1200px]">
        <div className="z-20 flex items-center">
          <Link href={'/'} className="mr-2 flex items-center sm:mr-4">
            {theme.brand.logo !== null && contractInfo?.image && (
              <Image
                src={theme.brand.logo || contractInfo?.image}
                height={90}
                width={90}
                style={{ height: theme.styles.logoHeight }}
                alt="logo"
                className="w-auto rounded-full object-scale-down"
              />
            )}
            {theme.brand.title !== null && contractInfo?.name && (
              <div
                className={`ml-4 text-xl font-bold text-skin-base ${
                  !onlyTitle && 'hidden sm:block'
                } `}
              >
                {theme.brand.title || contractInfo?.name}
              </div>
            )}
          </Link>

          <Link
            rel="noreferer noopener noreferrer"
            target="_blank"
            href={`${ETHERSCAN_BASEURL}/tokenholdings?a=${addresses?.treasury}`}
            className="ml-4 flex h-10 items-center justify-around rounded-xl border border-skin-stroke px-6 font-semibold text-skin-muted transition ease-in-out hover:scale-110 hover:bg-skin-backdrop"
          >
            Ξ {treasury ? formatTreasuryBalance(treasury) : '0'}
          </Link>
        </div>

        <div className="hidden items-center sm:flex">
          {theme.nav.primary.map(
            (item: NavigationItem, i: Key | null | undefined) => (
              <NavigationItemsComponent
                key={i}
                item={item}
                className="mr-4 flex h-10 items-center justify-around rounded-xl border border-skin-stroke px-6 font-semibold text-skin-muted transition ease-in-out hover:scale-110 hover:bg-skin-backdrop"
              />
            ),
          )}
          <CustomConnectButton className="h-10 rounded-xl border border-skin-stroke bg-skin-backdrop px-6 text-skin-base transition ease-in-out hover:scale-110" />
        </div>

        <button onClick={() => setShowMobile((x) => !x)} className="sm:hidden">
          <Bars3Icon className="h-10 rounded-xl border border-skin-stroke px-3 py-1 text-skin-muted focus:outline-none" />
        </button>
      </div>
      <MobileMenu show={showMobile} />
    </Fragment>
  )
}
