import { Box } from '@chakra-ui/react'
import { WeaveyState } from 'state/types'
import { useWeaveyManager } from 'state/weavey/hooks'
import { WeaveyToolTiopProps } from 'types'

const WeaveyHelper = ({ children, tip }: WeaveyToolTiopProps) => {
  const { setWeaveyContentPreference } = useWeaveyManager()

  const handleWeavey = (isOpen: boolean) => {
    const weaveyState: WeaveyState = {
      title: tip.title,
      content: tip.content,
      isOpen: isOpen,
    }
    setWeaveyContentPreference(weaveyState);
  }

  return (
    <Box
      w={'full'}
      onMouseEnter={() => handleWeavey(true)}
      onMouseLeave={() => handleWeavey(false)}
    >
      {children}
    </Box>
  )
}

export default WeaveyHelper
