import { useTheme } from '@/hooks/useTheme'
import { NavigationItem } from '@/types/ThemeConfig/NavigationItem'
import { Key } from 'react'
import NavigationItemComponent from './NavigationItem'

export default function Footer() {
  const [theme] = useTheme()

  return (
    <div className="flex justify-around py-16">
      <div className="flex flex-wrap items-center">
        {theme.nav.secondary.map(
          (item: NavigationItem, i: Key | null | undefined) => (
            <NavigationItemComponent
              key={i}
              item={item}
              className="sm:text-md mr-0 flex h-10 items-center justify-around rounded-xl px-4 text-sm text-skin-muted hover:text-skin-base sm:mr-4 sm:px-6"
            />
          ),
        )}
      </div>
    </div>
  )
}
