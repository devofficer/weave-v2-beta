import dynamic from 'next/dynamic';
import { Divider, Flex, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/lazy";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel, Pagination, Lazy, Autoplay } from "swiper";
import { useMediaQuery } from 'hooks/useMediaQuery';
import { IClaimableData } from 'types';

const Card = dynamic(() => import('components/common/Card'))

const ClaimableRewardsSwiper = ({ data }: { data: IClaimableData[] }) => {
  const { isLargeDesktop, isDesktop, isMobile } = useMediaQuery();
  const textBg = useColorModeValue('secGray.200', 'dark.600')

  const params = {
    slidesPerView: isLargeDesktop ? 3 : isDesktop ? 3 : isMobile ? 2 : 3,
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    keyboard: {
      enabled: true
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    mousewheel: true,
    modules: [Pagination, Mousewheel, Keyboard, Lazy, Autoplay],
    className: "claimable-swiper",
    preloadImages: false,
    lazy: true,
  }

  return (
    <Flex pt={3} pb={5} position={'relative'} justifyContent={'center'}>
      {data.length === 0 ? (
        <Text>No Claimable Rewards</Text>
      ) : (
        <Swiper {...params}>
          {data?.map((item: any, i: any) => (
            <SwiperSlide key={i}>
              <VStack
                spacing={8}
                gap={2}
                px={5}
                align={'center'}>
                <Image
                  boxSize={12}
                  src={item?.logoURI}
                  alt={'swap'}
                />
                <Text fontSize={'lg'}
                  bg={textBg}
                  borderRadius={'md'}
                  px={3}>
                  {item?.amount}$
                </Text>
              </VStack>
              {data.length !== i + 1 &&
                <Divider orientation='vertical' h={'64px'} />
              }
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="swiper-pagination"></div>
    </Flex >
  )
}

const ClaimableRewards = ({ data }: { data: IClaimableData[] }) => {
  return (
    <Card
      title={"Claimable Rewards"}
      body={<ClaimableRewardsSwiper data={data} />}
    />
  )
}
export default ClaimableRewards;