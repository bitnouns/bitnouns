import merge from 'lodash.merge'
import { lightTheme } from 'theme/default'
import { ThemeConfig } from 'types/ThemeConfig'

export const theme: ThemeConfig = merge(lightTheme, {
  styles: {
    fonts: {
      heading: 'Roboto',
    },
  },
  nav: {
    primary: [
      { label: 'DAO', href: '/vote' },
      { label: 'About', href: '/about' },
    ],
    secondary: [],
  },
} as Partial<ThemeConfig>)
