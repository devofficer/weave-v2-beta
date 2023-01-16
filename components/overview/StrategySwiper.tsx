import dynamic from 'next/dynamic';
import { Flex, Text, Box } from '@chakra-ui/react'
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/lazy";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Keyboard, Mousewheel, Navigation, Pagination, Lazy } from "swiper";
import { useMediaQuery } from 'hooks/useMediaQuery';
const StrategyCard = dynamic(() => import('./StrategyCard'))

const StrategySwiper = ({ data }: { data: any }) => {
  const { isExtraDesktop, isLargeDesktop, isDesktop, isMobile, minHeight1200 } = useMediaQuery();
  const gridFill: "row" | "column" | undefined = "row"
  const params = {
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    slidesPerView: minHeight1200 ? 5 : isExtraDesktop ? 4 : isLargeDesktop ? 3 : isDesktop ? 3 : isMobile ? 1 : 4,
    spaceBetween: isExtraDesktop ? 50 : isLargeDesktop ? 20 : isDesktop ? 20 : 10,
    grid: {
      rows: minHeight1200 ? 3 : 2,
      fill: gridFill
    },
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    keyboard: {
      enabled: true
    },
    mousewheel: true,
    modules: [Grid, Pagination, Navigation, Mousewheel, Keyboard, Lazy],
    className: "strategy-swiper",
    preloadImages: false,
    lazy: true,
  }

  return (
    <>
      <Flex>
        <Swiper {...params}>
          {data?.map((strategy: any, i: any) => (
            <SwiperSlide key={i}>
              <StrategyCard data={strategy} />
            </SwiperSlide>
          ))
          }
          {data.length === 0 && (
            <Flex height={'calc(100vh - 220px)'} justifyContent="center" alignItems={'center'} px={{ base: 5, md: 20 }} py={3} mt="1rem" borderRadius={'xl'} shadow={'xl'} >
              <Text fontSize="md">No Data</Text>
            </Flex>
          )}
        </Swiper>
        <Box className="swiper-button-next"></Box>
        <Box className="swiper-button-prev"></Box>
      </Flex>
    </>
  )
}
export default StrategySwiper;