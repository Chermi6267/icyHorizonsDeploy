import api from "@/http/api";
import { toast } from "react-hot-toast";
import { setNewHeader } from "@/store/userSlice";
import { logIn } from "@/store/authSlice";
import { AppDispatch } from "@/store";

export const changeHeaderHandler = (
  file: File,
  dispatch: AppDispatch,
  headerInputRef: React.RefObject<HTMLInputElement>
) => {
  const formData = new FormData();
  formData.append("file", file);

  api
    .put("/user/header", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      toast.success("Шапка профиля изменена", {
        style: {
          backgroundColor: "rgba(65, 67, 112, 0.25)",
          outline: "2px solid rgba(65, 67, 112, 1)",
          color: "white",
          backdropFilter: "blur(2px)",
        },
        iconTheme: { primary: "#a8cd9f", secondary: "white" },
      });
      localStorage.setItem("token", res.data.accessToken);
      dispatch(setNewHeader({ header: res.data.header }));
      dispatch(logIn(res.data.accessToken));
      if (headerInputRef && headerInputRef.current) {
        headerInputRef.current.value = "";
      }
    })
    .catch((error) => {
      toast.error("Не смогли обновить шапку профиля. Попробуйте позже", {
        style: {
          backgroundColor: "rgba(65, 67, 112, 0.25)",
          outline: "2px solid rgba(65, 67, 112, 1)",
          color: "white",
          backdropFilter: "blur(2px)",
        },
        iconTheme: { primary: "#eb4335", secondary: "white" },
      });
      console.error(error);
    });
};
