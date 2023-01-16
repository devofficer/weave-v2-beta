import type { NextPage } from 'next'
import NextLink from "next/link"
import dynamic from 'next/dynamic'
import {
  Box,
  Heading,
  Link,
  Text,
  Stack,
} from '@chakra-ui/react';
const Home = dynamic(() => import('components/layout/Home'))

const App: NextPage = () => {

  return (
    <Home title={`${process.env.NEXT_PUBLIC_APP_NAME} | Home`} active="home">
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          Weave Financial <br />
          <Text as={'span'} color={'green.400'}>
            Frontend V2
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}>
          <NextLink href='/collections' passHref>
            <Link
              color={'white'}
              bg={'green.400'}
              rounded={'full'}
              py={2}
              px={6}
              _hover={{
                bg: 'green.500',
              }}>
              Get Start
            </Link>
          </NextLink>
        </Stack>
      </Stack>
    </Home>
  )
}

export default App
