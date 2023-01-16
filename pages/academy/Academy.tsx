import type { NextPage } from 'next';
import dynamic from 'next/dynamic'
import {
  Flex,
  Heading,
} from '@chakra-ui/react';
const Home = dynamic(() => import('components/layout/Home'))

const Academy: NextPage = () => {

  return (
    <Home title="Weave Finanial | Strategy academy" active='academy'>
      <Flex flexDirection={'column'} gap={8}>
        <Heading as='h3' size='lg'>
          Academy Page
        </Heading>

        <Heading
          textAlign={'center'}
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '4xl' }}
          lineHeight={'110%'}>
          Coming Soon
        </Heading>
      </Flex>
    </Home>
  );
};

export default Academy;
