import { MutableRefObject } from "react";
import styles from "../styles.module.scss";

interface Props {
  text: string;
  isFetching: boolean;
  isError: boolean;
  gigaTextRef: MutableRefObject<HTMLDivElement | null>;
}

function GigaChat(props: Props) {
  const { text, gigaTextRef, isFetching, isError } = props;

  return (
    <>
      <h2 className={styles.giga_chat__main_text}>Giga Chat</h2>
      <p ref={gigaTextRef} className={styles.giga_chat__giga_text}>
        {isError ? (
          "Произошла ошибка в работе Giga Chat. Повторите попытку позже"
        ) : (
          <>
            {text}
            {isFetching && <span className={styles.blinking_cursor}></span>}
          </>
        )}
      </p>
    </>
  );
}

export default GigaChat;
