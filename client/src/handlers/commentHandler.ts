import { toast } from "react-hot-toast";
import api from "@/http/api";

const TOAST_STYLE = {
  style: {
    backgroundColor: "rgba(65, 67, 112, 0.25)",
    outline: "2px solid rgba(65, 67, 112, 1)",
    color: "white",
    backdropFilter: "blur(5px)",
  },
  iconTheme: {
    secondary: "white",
  },
};

type CommentHandlerParams = {
  event: React.MouseEvent;
  commentText: string;
  ratings: {
    accessibility: [number, (v: number) => void];
    improvement: [number, (v: number) => void];
    tourism: [number, (v: number) => void];
  };
  landmarkId: string | string[];
  refetch: () => void;
  setters: {
    setNeedRefetch: (v: boolean) => void;
    setCommentText: React.Dispatch<React.SetStateAction<string>>;
  };
  isAuth: boolean;
};

export const commentHandler = async ({
  event,
  commentText,
  ratings,
  landmarkId,
  refetch,
  setters,
  isAuth,
}: CommentHandlerParams) => {
  event.preventDefault();

  if (!isAuth) {
    toast.error("Вы не авторизованы", {
      ...TOAST_STYLE,
      iconTheme: { ...TOAST_STYLE.iconTheme, primary: "#eb4335" },
    });
    return;
  }

  if (commentText.trim() === "") {
    toast("Заполните поле отзыва", {
      ...TOAST_STYLE,
      iconTheme: { ...TOAST_STYLE.iconTheme, primary: "#ffc500" },
    });
    return;
  }

  try {
    // Вычисляем средний рейтинг
    const ratingValues = Object.values(ratings).map(([value]) => value);
    const averageRating = Math.ceil(
      ratingValues.reduce((a, b) => a + b, 0) / 3
    );

    await api.post("/comment/create", {
      text: commentText,
      stars: averageRating,
      landmarkId,
      accessibility: ratings.accessibility[0],
      improvement: ratings.improvement[0],
      tourismInfrastructure: ratings.tourism[0],
    });

    // Сбрасываем состояния
    Object.values(ratings).forEach(([, setter]) => setter(0));
    setters.setCommentText("");

    // Обновляем данные
    refetch();
    setters.setNeedRefetch(true);

    await fetch("/landmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ landmarkId }),
    });

    toast.success("Отзыв оставлен", {
      ...TOAST_STYLE,
      iconTheme: { ...TOAST_STYLE.iconTheme, primary: "#a8cd9f" },
    });
  } catch (error) {
    toast.error("Что-то пошло не так", {
      ...TOAST_STYLE,
      iconTheme: { ...TOAST_STYLE.iconTheme, primary: "#eb4335" },
    });
    console.error(error);
  }
};
