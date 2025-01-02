import api from "@/http/api";
import { toast } from "react-hot-toast";
import { setNewAvatar } from "@/store/userSlice";
import { logIn } from "@/store/authSlice";
import { AppDispatch } from "@/store";

export const changeAvatarHandler = (
  file: File,
  dispatch: AppDispatch,
  avatarInputRef: React.RefObject<HTMLInputElement>
) => {
  const formData = new FormData();
  formData.append("file", file);

  api
    .put("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      toast.success("Фото профиля изменено", {
        style: {
          backgroundColor: "rgba(65, 67, 112, 0.25)",
          outline: "2px solid rgba(65, 67, 112, 1)",
          color: "white",
          backdropFilter: "blur(2px)",
        },
        iconTheme: { primary: "#a8cd9f", secondary: "white" },
      });
      localStorage.setItem("token", res.data.accessToken);
      dispatch(setNewAvatar({ avatar: res.data.avatar }));
      dispatch(logIn(res.data.accessToken));
      if (avatarInputRef && avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    })
    .catch((error) => {
      toast.error("Не смогли обновить фото профиля. Попробуйте позже", {
        style: {
          backgroundColor: "rgba(65, 67, 112, 0.25)",
          outline: "2px solid rgba(65, 67, 112, 1)",
          color: "white",
          backdropFilter: "blur(5px)",
        },
        iconTheme: { primary: "#eb4335", secondary: "white" },
      });
      console.error(error);
    });
};
