import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box, useColorModeValue } from '@chakra-ui/react'
import { HomeProps } from 'types';
const Header = dynamic(() => import('./header'))

const Home = ({ children, title, active, ...rest }: HomeProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header active={active}>
        <Box id="main"
          height={'calc(100vh - 112px)'}
          bg={useColorModeValue('secGray.300', 'dark.900')}
          px={{ base: 4, md: 20 }}
          py={2}
          overflow={'auto'}
          borderBottomRightRadius={20}
          borderBottomLeftRadius={20}
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '8px',
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
          }}
          {...rest}
        >
          {children}
        </Box>
      </ Header>
    </>
  );
};

export default Home;
