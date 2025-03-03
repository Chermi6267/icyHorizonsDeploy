// import { useRef, useState } from "react";
// import { commentHandler } from "@/handlers/commentHandler";
// import { ratingHandler } from "@/handlers/ratingHandler";
// import useAuth from "@/hook/useAuth";
// import StarRating from "@/components/landmark/starRating";
// import styles from "./styles.module.scss";

// interface CommentInputProps {
//   landmarkId: string;
//   refetch: () => void;
//   setNeedRefetch: (value: boolean) => void;
// }

// export function CommentInput({
//   landmarkId,
//   refetch,
//   setNeedRefetch,
// }: CommentInputProps) {
//   const [commentText, setCommentText] = useState("");
//   const { isAuth } = useAuth();
//   const commentRef = useRef<HTMLDivElement>(null);
//   const [rating, setRating] = useState<number[]>([1, 1, 1, 1, 1]);
//   const windowWidth = 12454;

//   return (
//     <div role="form" className={styles.comment_cont__comment_input}>
//       <div
//         onKeyDown={(e) =>
//           commentHandler(
//             e,
//             false,
//             commentText,
//             rating,
//             landmarkId,
//             refetch,
//             setNeedRefetch,
//             setCommentText,
//             commentRef,
//             isAuth,
//             windowWidth
//           )
//         }
//         className={styles.comment_input__input_field}
//         contentEditable
//         spellCheck="false"
//         onInput={(e) => {
//           if (e.currentTarget.innerText.trim().length > 200) {
//             alert("Слишком большой");
//             if (commentRef && commentRef.current) {
//               commentRef.current.innerText = "";
//             }
//           }
//           setCommentText(e.currentTarget.innerText.trim());
//         }}
//         ref={commentRef}
//       />

//       <div className={styles.comment_input__underline} />

//       <StarRating
//         rating={rating}
//         ratingHandler={(n: number) => ratingHandler(rating, setRating, n)}
//       />

//       <button
//         onClick={(e) =>
//           commentHandler(
//             e,
//             true,
//             commentText,
//             rating,
//             landmarkId,
//             refetch,
//             setNeedRefetch,
//             setCommentText,
//             commentRef,
//             isAuth,
//             windowWidth
//           )
//         }
//         className={styles.comment_input__submit_btn}
//       >
//         Отправить
//       </button>
//     </div>
//   );
// }
import React, { useRef, useEffect, ChangeEvent } from "react";
import styles from "./styles.module.scss";

interface MultilineTextInputProps {
  maxLines?: number;
  value: string;
  setValue: (newValue: string) => void;
}

const CommentInput: React.FC<MultilineTextInputProps> = ({
  maxLines = 5,
  value,
  setValue,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Обработчик изменения текста
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);

    // Автоматически подстраиваем количество строк
    adjustTextareaHeight();
  };

  // Подгонка высоты textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Сбрасываем высоту до одной строки для перерасчета
    textarea.style.height = "auto";

    // Вычисляем новую высоту
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10
    );
    const maxHeight = lineHeight * maxLines;

    // Ограничиваем высоту максимальным количеством строк
    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${Math.max(scrollHeight, lineHeight)}px`;
      textarea.style.overflowY = "hidden";
    }
  };

  // Подгонка высоты при изменении значения
  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className={styles.container}>
      <textarea
        className={styles.container__comment_input}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Отзыв"
        rows={1} // Начальное значение строк
      />
      <div className={styles.comment_input__underline} />
    </div>
  );
};

export default CommentInput;
