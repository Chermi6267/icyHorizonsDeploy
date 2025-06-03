import styles from "./styles.module.scss";

interface Props {}

function About(props: Props) {
  const {} = props;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Dirty deeds done dirty cheep <br></br>With quality you cant beat
      </h1>
      <h3 style={{ fontWeight: 400 }} className={styles.sub_title}>
        Мы —{" "}
        <span style={{ fontWeight: 600 }} className={styles.text_span__strong}>
          D4C
        </span>
        . Мы решаем невозможное, не тратя лишнего.{" "}
        <span className={styles.text_span__strong}>Креатив,</span>{" "}
        <span className={styles.text_span__medium}>скорость,</span>{" "}
        <span className={styles.text_span__light}>качество</span> — вот что
        отличает нас. Мы идем вперед, ломая стандарты и преодолевая любые
        преграды, чтобы достичь{" "}
        <span className={styles.text_span__medium}>наилучшего результата</span>
      </h3>

      <div className={styles.cont}>
        <div className={styles.cont__item}>
          <div className={styles.avatar_role}>
            <div
              className={styles.avatar_role__image}
              style={{ backgroundImage: `url("/victorChernikov.png")` }}
            />
            <h2
              className={styles.name_desc__prof}
              style={{ fontFamily: "var(--pixelify_font)" }}
            >
              Разработчик
            </h2>
          </div>
          <div className={styles.name_desc}>
            <h2 className={styles.name_desc__prof}>Виктор Черников</h2>
            <p className={styles.name_desc__desc}>
              Существо, которое может провести 12 часов за компьютером, не
              заметив, как весь мир изменился, а потом заявить, что баги — это
              фича
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "15vh",
          backgroundColor: "transparent",
        }}
      ></div>
    </main>
  );
}

export default About;
