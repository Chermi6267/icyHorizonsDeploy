import { useState } from "react";
import CommentInput from "../commentInput/commentInput";
import SubRatingForm from "./subRatingForm";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { commentHandler } from "@/handlers/commentHandler";
import useAuth from "@/hook/useAuth";

const variants = {
  hidden: {
    transform: "translateX(-100%) translateY(100%)",
    opacity: 0,
    height: 0,
  },

  visible: {
    transform: "translateX(0) translateY(0)",
    opacity: 1,
    height: "auto",
  },
};

interface Props {
  refetch: () => void;
  setNeedRefetch: (value: boolean) => void;
  landmarkId: string | string[];
}

function CommentForm(props: Props) {
  const { refetch, setNeedRefetch, landmarkId } = props;
  const [commentText, setCommentText] = useState<string>("");
  const [accessibility, setAccessibility] = useState<number>(0);
  const [improvement, setImprovement] = useState<number>(0);
  const [tourismInfrastructure, setTourismInfrastructure] = useState<number>(0);
  const { isAuth } = useAuth();

  return (
    <form style={{ overflow: "hidden", padding: 2 }}>
      <CommentInput
        value={commentText}
        setValue={(newValue) => setCommentText(newValue)}
      />

      <motion.div
        variants={variants}
        initial="hidden"
        animate={commentText !== "" && commentText ? "visible" : "hidden"}
        className={styles.wrapper}
      >
        <button
          onClick={(e) =>
            commentHandler({
              event: e,
              commentText,
              ratings: {
                accessibility: [accessibility, setAccessibility],
                improvement: [improvement, setImprovement],
                tourism: [tourismInfrastructure, setTourismInfrastructure],
              },
              landmarkId,
              refetch,
              setters: {
                setNeedRefetch,
                setCommentText,
              },
              isAuth,
            })
          }
          type="button"
          className={styles.wrapper__submit_btn}
        >
          Отправить
        </button>

        <div className={styles.wrapper__sub_rating}>
          <SubRatingForm
            text={"Доступность"}
            rating={accessibility}
            setRating={(newValue: number) => setAccessibility(newValue)}
          />

          <SubRatingForm
            text={"Комфорт и благоустройство"}
            rating={improvement}
            setRating={(newValue: number) => setImprovement(newValue)}
          />

          <SubRatingForm
            text={"Туристическая инфраструктура"}
            rating={tourismInfrastructure}
            setRating={(newValue: number) => setTourismInfrastructure(newValue)}
          />
        </div>
      </motion.div>
    </form>
  );
}

export default CommentForm;
