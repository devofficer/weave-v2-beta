import NextImage from "next/image";
import { chakra } from '@chakra-ui/react'
import { IImageProps } from "types";

const Image = ({ src, width, height }: IImageProps) => {

  const ChakraImage = chakra(NextImage, {
    shouldForwardProp: (prop) =>
      [
        "width",
        "height",
        "src",
        "alt",
        "quality",
        "placeholder",
        "blurDataURL",
        "cursor",
        "loader",
      ].includes(prop),
  });

  return (
    <ChakraImage src={src} alt="image" width={width} height={height} />
  )
}

export default Image;