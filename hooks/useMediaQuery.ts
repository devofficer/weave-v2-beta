import { useMediaQuery as mediaQuery } from "@chakra-ui/react"

export const useMediaQuery = () => {
  const [isExtraDesktop] = mediaQuery('(min-width: 1200px)')
  const [isLargeDesktop] = mediaQuery('(min-width: 960px)')
  const [isDesktop] = mediaQuery('(min-width: 768px)')
  const [isMobile] = mediaQuery('(min-width: 320px)')
  const [minHeight1200] = mediaQuery('(min-height: 1200px)')

  return { isExtraDesktop, isLargeDesktop, isDesktop, isMobile, minHeight1200 }
}
