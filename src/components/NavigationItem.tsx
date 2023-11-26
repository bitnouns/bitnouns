import { NavigationItem } from '@/types/ThemeConfig/NavigationItem'
import Link from 'next/link'

export default function NavigationItemComponent({
  item,
  className,
}: {
  item: NavigationItem
  className: string
}) {
  const isExternal = item.href.startsWith('http')
  return (
    <Link
      className={className}
      href={item.href}
      rel={isExternal ? 'noreferer noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {item.label}
    </Link>
  )
}
