import api from "@/http/api";
import { toast } from "react-hot-toast";
import { setNewGroupId } from "@/store/userSlice";
import { AppDispatch } from "@/store";

export const changeGroup = (
  newGroupId: number | null,
  dispatch: AppDispatch
) => {
  api
    .put("/user/group", { newGroupId })
    .then((res) => {
      toast.success("Роль успешно изменена", {
        style: {
          backgroundColor: "rgba(65, 67, 112, 0.25)",
          outline: "2px solid rgba(65, 67, 112, 1)",
          color: "white",
          backdropFilter: "blur(2px)",
        },
        iconTheme: { primary: "#a8cd9f", secondary: "white" },
      });

      dispatch(setNewGroupId({ groupId: res.data.newGroupId }));
    })
    .catch((error) => {
      toast.error("Произошла ошибка", {
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
