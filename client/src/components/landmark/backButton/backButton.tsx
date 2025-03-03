import Arrow from "@/components/svg/arrow";
import Link from "next/link";
import styles from "./styles.module.scss";

interface Props {
  href: string;
}

function BackButton(props: Props) {
  const { href } = props;

  return (
    <nav>
      <Link href={href}>
        <button className={styles.empty_btn}>
          <div className={styles.empty_btn__back_arrow}>
            <Arrow className={styles.back_arrow__svg} />
            <p className={styles.back_arrow__text}>Назад</p>
          </div>
        </button>
      </Link>
    </nav>
  );
}

export default BackButton;
