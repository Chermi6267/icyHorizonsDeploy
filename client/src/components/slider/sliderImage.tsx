import Image from "next/image";

interface Props {
  imgName: string;
}

function SliderImage(props: Props) {
  const { imgName } = props;

  return (
    <Image
      quality={70}
      sizes="width: 100%; height: 100%"
      src={
        imgName.startsWith("/")
          ? imgName
          : `${process.env.NEXT_PUBLIC_SERVER_IMG_URL}/landmark/image/default/${imgName}`
      }
      fill
      alt="Здесь явно должна быть красивая картинка"
    />
  );
}

export default SliderImage;
