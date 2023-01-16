import { Box, Flex, Image } from '@chakra-ui/react'
import { IImagePairProps } from "types";

const ImagePair = ({ src1, src2, boxSize }: IImagePairProps) => {

  return (
    <Box>

      <Flex position={'relative'}>
        <Image
          zIndex={1}
          boxSize={boxSize}
          src={src1}
          alt='Image'
          borderRadius={'full'}
        />
        <Image
          zIndex={0}
          boxSize={boxSize}
          src={src2}
          alt='Image'
          borderRadius={'full'}
          ml={'-12px'}
        />
      </Flex>
    </Box>
  )
}

export default ImagePair;