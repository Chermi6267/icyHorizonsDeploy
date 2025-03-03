import { ILandmark } from "@/interfaces/landmark";
import Slider from "../slider/slider";
import styles from "./styles.module.scss";

interface Props {
  landmarkData: ILandmark;
}

function SliderDescription(props: Props) {
  const { landmarkData } = props;

  return (
    <section className={styles.landmark_main}>
      <div className={styles.landmark_main__text_cont}>
        <p>{landmarkData.description}</p>
      </div>

      <Slider
        className={styles.landmark_main__slider}
        images={landmarkData.landmarkPhoto}
      />
    </section>
  );
}

export default SliderDescription;
