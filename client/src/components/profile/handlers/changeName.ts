import api from "@/http/api";
import { toast } from "react-hot-toast";
import { setNewName } from "@/store/userSlice";
import { logIn } from "@/store/authSlice";
import { AppDispatch } from "@/store";

export const changeNameHandler = (
  name: string,
  currentName: string | null,
  nameRef: React.RefObject<HTMLDivElement>,
  dispatch: AppDispatch
) => {
  if (name !== currentName) {
    api
      .put("/user/name", { name })
      .then((res) => {
        toast.success("Имя пользователя изменено", {
          style: {
            backgroundColor: "rgba(65, 67, 112, 0.25)",
            outline: "2px solid rgba(65, 67, 112, 1)",
            color: "white",
            backdropFilter: "blur(2px)",
          },
          iconTheme: { primary: "#a8cd9f", secondary: "white" },
        });
        localStorage.setItem("token", res.data.accessToken);
        dispatch(setNewName({ name: res.data.newName }));
        dispatch(logIn(res.data.accessToken));
      })
      .catch((error) => {
        if (nameRef && nameRef.current) {
          nameRef.current.innerHTML = currentName || "";
        }
        toast.error(error.response.data.message, {
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
  }
};
