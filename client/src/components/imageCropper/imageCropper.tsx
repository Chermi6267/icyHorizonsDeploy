import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import styles from "./styles.module.scss";
import { useClickOutside } from "@/hook/useClickOutside";

interface CroppedArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface CropperProps {
  format: number;
  imageSrc: string;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<CropperProps> = ({
  format,
  imageSrc,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);
  const cropperRef = useRef<HTMLDivElement>(null);

  const getCroppedImg = async (): Promise<File | null> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !croppedAreaPixels) return null;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImg();
    if (croppedImage) {
      onCropComplete(croppedImage);
    }
  };

  useClickOutside(cropperRef, onCancel);
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
      if (event.key === "Enter") {
        handleSave();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={cropperRef} className={styles.image_cropper_cont}>
      <div className={styles.image_cropper}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={format}
          classes={{
            containerClassName: styles.image_cropper__easy_crop_container,
          }}
          cropShape="rect"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, areaPixels) =>
            setCroppedAreaPixels(areaPixels as CroppedArea)
          }
        />
      </div>

      <div className={styles.image_cropper__btn_cont}>
        <button onClick={handleSave} className={styles["btn_cont__btn-submit"]}>
          Сохранить
        </button>

        <button className={styles["btn_cont__btn-cancel"]} onClick={onCancel}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
