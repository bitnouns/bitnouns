import { useTheme } from '@/hooks/useTheme'
import { NavigationItem } from '@/types/ThemeConfig/NavigationItem'
import { Transition } from '@headlessui/react'
import { Key } from 'react'
import CustomConnectButton from './CustomConnectButton'
import NavigationItemComponent from './NavigationItem'

export default function MobileMenu({ show }: { show: boolean }) {
  const [theme] = useTheme()

  return (
    <Transition
      show={show}
      enter="transition-[height] duration-300"
      enterFrom="h-0 w-full"
      enterTo="h-52 w-full"
      leave="transition-[height] duration-300"
      leaveFrom="h-52 w-full"
      leaveTo="h-0 w-full"
    >
      <div className="mb-4 flex flex-col px-4">
        {theme.nav.primary.map(
          (item: NavigationItem, i: Key | null | undefined) => (
            <NavigationItemComponent
              key={i}
              item={item}
              className="mb-2 flex h-10 items-center justify-around rounded-xl border border-skin-stroke px-6 font-semibold text-skin-muted transition ease-in-out hover:scale-110"
            />
          ),
        )}
        <CustomConnectButton className="h-10 w-full rounded-xl border border-skin-stroke bg-skin-backdrop px-6 text-skin-base transition ease-in-out hover:scale-110" />
      </div>
    </Transition>
  )
}
