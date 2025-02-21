"use client";

import Slider from "../slider/slider";
import styles from "./styles.module.scss";
import Link from "next/link";

interface Props {}

function Tour(props: Props) {
  const {} = props;
  const tourData = [
    { id: 1, photoPath: "/SakhaSled/1.jpeg", landmarkId: 1 },
    { id: 2, photoPath: "/SakhaSled/2.jpeg", landmarkId: 2 },
    { id: 3, photoPath: "/SakhaSled/3.jpeg", landmarkId: 3 },
    { id: 4, photoPath: "/SakhaSled/4.jpeg", landmarkId: 4 },
  ];

  return (
    <section className={styles.tour}>
      <h2 className={styles.tour__title}>
        Авторские туры <span>SakhaSled</span> в Якутии
      </h2>

      <Slider className={styles.tour__slider} images={tourData} />

      <h3 className={styles.tour__desc}>
        Путешествия и экспедиции на снегоходах с компанией SakhaSled. Мото
        эндуро, 4x4 и квадроциклах. Эксклюзивная рыбалка
      </h3>

      <nav>
        <Link
          aria-label="Туристическое агенство по Республике Саха Якутия Sakha Sled"
          href={"https://sakhasled.com/"}
        >
          <button className={styles.tour__btn}>Перейти</button>
        </Link>
      </nav>
    </section>
  );
}

export default Tour;
