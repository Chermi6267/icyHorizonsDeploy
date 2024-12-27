import Image from "next/image";
import { useState } from "react";

interface Props {
  imgName: string;
}

function SliderImage(props: Props) {
  const { imgName } = props;
  const [isSmall, setIsSmall] = useState(true);

  return (
    <Image
      quality={100}
      sizes="width: 100%; height: 100%"
      src={
        imgName.startsWith("/")
          ? imgName
          : isSmall
          ? `${process.env.NEXT_PUBLIC_SERVER_IMG_URL}/landmark/image/small/${imgName}`
          : `${process.env.NEXT_PUBLIC_SERVER_IMG_URL}/landmark/image/default/${imgName}`
      }
      fill
      style={isSmall ? { filter: "blur(10px)" } : {}}
      alt="Здесь явно должна быть красивая картинка"
      onLoad={() => {
        setIsSmall(false);
      }}
    />
  );
}

export default SliderImage;
