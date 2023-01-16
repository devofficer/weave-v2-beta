import Link from 'next/link';
import { useColorModeValue, useMediaQuery } from '@chakra-ui/react'

const Logo = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)')
  const fillBgColor = useColorModeValue(isDesktop ? "#fff" : "#66d9e8", "#fff");
  const fillLogoColor = useColorModeValue(isDesktop ? "#66d9e8" : "#fff", isDesktop ? "#24388a" : "#2D3748");
  return (
    <Link href="/">
      <svg id="Capa_1" width={60} data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 236 236">
        <path className="cls-1" fill={fillBgColor} d="M312,396.5a118,118,0,1,0-118-118A118,118,0,0,0,312,396.5Z" transform="translate(-194 -160.5)" />
        <path className="cls-2" fill={fillLogoColor} d="M364.38,244.19A15,15,0,0,1,378.6,234h5.73l-18.21,54.83c-1.53,4.33-5.06,13.37-5.06,13.37-3.73-6.81-8.88-22-8.88-22Z" transform="translate(-194 -160.5)" />
        <path className="cls-2" fill={fillLogoColor} d="M232.48,304.71l-18.33-55.06a12.11,12.11,0,0,1,11.5-15.92h0l22.57,67.39c15.29,37.56,32.94,40.46,45.57,39.09C282.62,350.34,251,357.66,232.48,304.71Z" transform="translate(-194 -160.5)" />
        <path className="cls-2" fill={fillLogoColor} d="M309.56,317.49c-5.59,7.35-11.18,10.36-16.84,10.51h-.51c-10.41-.31-20.64-10.26-31-39.22l-18.18-55H248a16.1,16.1,0,0,1,15.19,10.9L277,285.21c5.84,14.68,8.54,23.61,15.48,23.58,4.36,0,7-3.5,9.91-9.84.14-.31,1.63-3.87,1.77-4.19l2.7,8.43a121.44,121.44,0,0,0,4.68,11.57C311.35,314.92,309.66,317.34,309.56,317.49Z" transform="translate(-194 -160.5)" />
        <path className="cls-2" fill={fillLogoColor} d="M308.93,304.71l-12.36-36.65-11.18,33.23c-1.63-3.63-3.31-8.17-5.41-13.39L276.23,278l8.23-24.34c1.37-4.05,3.72-11,11.68-11s10.72,6.61,12.72,11.55l15.82,46.89c13.85,37.57,32.92,40.47,45.56,39.1C359.06,350.35,327.46,357.66,308.93,304.71Z" transform="translate(-194 -160.5)" />
        <path className="cls-2" fill={fillLogoColor} d="M398.57,288.68c-10.31,29-20.54,38.9-31,39.2h-.51c-10.41-.31-20.65-10.25-31-39.22l-14-41.24c.68-3.3,4.38-4.87,7.56-4.86,5.67,0,8.89,4.09,11.24,11,1.74,5.1,11,31.54,11,31.54,5.84,14.69,8.54,23.61,15.48,23.59s9.63-8.9,15.48-23.59l17.43-51.22A11.9,11.9,0,0,1,412.05,244a11.82,11.82,0,0,1-.46,5.54Z" transform="translate(-194 -160.5)" />
      </svg>
    </Link>
  )
}

export default Logo;