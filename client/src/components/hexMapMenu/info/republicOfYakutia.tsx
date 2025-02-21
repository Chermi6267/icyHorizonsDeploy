import Slider from "../../slider/slider";
import styles from "../styles.module.scss";
import { ILandmarksByAdminCenter } from "@/interfaces/landmark";

interface Props {
  data: ILandmarksByAdminCenter | undefined;
  isLoading: boolean;
  isError: boolean;
}

function InfoRepublicOfYakutia(props: Props) {
  const { data, isLoading, isError } = props;
  const content = isLoading ? (
    <div
      className={styles.preloader}
      role="progressbar"
      aria-label="Загрузка данных"
    >
      <div className={styles.preloader__cell} />
      <div className={styles.preloader__cell} />
      <div className={styles.preloader__cell} />
    </div>
  ) : isError ? (
    <p className={styles.info_text} role="alert">
      Что-то пошло не так!
    </p>
  ) : !data?.adminCenter ? null : (
    <>
      <h2 className={styles.main_data__title}>{data.adminCenter.name}</h2>
      {data.landmarks.length > 0 ? (
        <article className={styles.main_data__landmark_info}>
          <div
            style={{ justifyContent: "center" }}
            className={styles.landmark_info__first_cell}
          >
            <Slider
              className={styles.first_cell__slider}
              images={data.landmarks[0].landmarkPhoto}
            />
          </div>

          <p className={styles.landmark_info__description}>
            {data.landmarks[0].description}
          </p>
        </article>
      ) : (
        <p className={styles.info_text}>
          Здесь пока что пусто, но наша команда спешит это исправить
        </p>
      )}
    </>
  );

  return content;
}

export default InfoRepublicOfYakutia;
