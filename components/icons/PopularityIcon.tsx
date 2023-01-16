import { Box } from '@chakra-ui/react'
import { useMediaQuery } from 'hooks/useMediaQuery';

const PopularityIcon = ({ width, color }: { width: { sm?: string, md?: string, lg?: string }, color: string }) => {

  const { isDesktop, isLargeDesktop } = useMediaQuery()

  const responsiveWidth = () => {
    return isLargeDesktop ? width.lg : isDesktop ? width.md : width.sm;
  }

  return (
    <>
      <Box>
        <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width={responsiveWidth()} viewBox="0 0 31.59 40">
          <g id="Layer_2-2" data-name="Layer 2">
            <g>
              <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4px" className="cls-1" d="M18.96,2c-2.45,1.44-4.45,3.55-5.75,6.08-.46,.9-.83,1.85-1.1,2.84-.35,1.26-.54,2.58-.54,3.95,0,2.09,.43,4.09,1.21,5.89-2.8-1.44-5.04-3.8-6.33-6.69-.18-.4-.34-.81-.47-1.23-2,2.5-3.37,5.75-3.82,9.38-.09,.65-.16,1.3-.16,1.98,0,.06,0,.12,0,.17,.09,7.54,6.23,13.62,13.79,13.62" />
              <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4px" className="cls-1" d="M15.79,38c5.68,0,10.56-3.44,12.67-8.34,.7-1.62,1.09-3.4,1.11-5.28,0-.06,0-.12,0-.17,0-.67-.08-1.33-.16-1.98-.02-.19-.05-.38-.09-.57-.54-2.84-2.32-5.3-4.77-6.83-1.41-.88-2.63-2.04-3.59-3.4-.65-.93-1.17-1.96-1.55-3.05-.44-1.27-.69-2.63-.69-4.05,0-.8,.08-1.57,.23-2.33" />
            </g>
          </g>
        </svg>
      </Box>
    </>
  )
}
export default PopularityIcon;