import themeAtom from '@/theme'
import { useAtom } from 'jotai'

export const useTheme = () => {
  return useAtom(themeAtom)
}
