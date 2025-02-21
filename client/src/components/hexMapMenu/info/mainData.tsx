import Slider from "../../slider/slider";
import Star from "../../svg/star";
import styles from "../styles.module.scss";
import { ILandmarksByAdminCenter } from "@/interfaces/landmark";

interface Props {
  data: ILandmarksByAdminCenter | undefined;
  isLoading: boolean;
  isError: boolean;
}

function InfoMainData({ data, isLoading, isError }: Props) {
  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    return (
      <p className={styles.info_text} role="alert">
        Что-то пошло не так!
      </p>
    );
  }

  if (!data?.adminCenter) return null;

  return (
    <>
      <h2 id="admin-center-title" className={styles.main_data__title}>
        {data.adminCenter.name}
      </h2>
      {data.landmarks.length > 0 ? (
        <LandmarkInfo data={data} />
      ) : (
        <p className={styles.info_text}>
          Здесь пока что пусто, но наша команда спешит это исправить
        </p>
      )}
    </>
  );
}

function Preloader() {
  return (
    <div
      className={styles.preloader}
      role="progressbar"
      aria-label="Загрузка данных"
    >
      <div className={styles.preloader__cell} />
      <div className={styles.preloader__cell} />
      <div className={styles.preloader__cell} />
    </div>
  );
}

function LandmarkInfo({ data }: { data: ILandmarksByAdminCenter }) {
  return (
    <>
      <h3 className={styles.main_data__sub_title}>Лучшее для вас</h3>
      <div className={styles.main_data__landmark_info}>
        <div className={styles.landmark_info__first_cell}>
          <Slider
            className={styles.first_cell__slider}
            images={data.landmarks[0].landmarkPhoto}
          />
          <div className={styles.first_cell__right}>
            <h3 className={styles.right__landmark_name}>
              {data.landmarks[0].name}
            </h3>
            <div className={styles.right__rating}>
              <Star className={styles.rating__star} />
              <p>
                {String(parseFloat(data.landmarks[0].rating).toFixed(1)).split(
                  "."
                )[1] === "0"
                  ? parseFloat(data.landmarks[0].rating).toFixed(0)
                  : parseFloat(data.landmarks[0].rating).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <p className={styles.landmark_info__description}>
          {data.landmarks[0].description}
        </p>
      </div>
    </>
  );
}

export default InfoMainData;
