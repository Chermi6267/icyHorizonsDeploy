import { logIn, logOut } from "@/store/authSlice";
import { setUser } from "@/store/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function AuthHandler() {
  const dispatch = useDispatch();

  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("token") !== null
  ) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refreshAccessToken`,
        {},
        { withCredentials: true }
      )
      .then(async (res) => {
        const userData = await axios
          .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`, {
            headers: {
              Authorization: `Bearer ${res.data.accessToken}`,
            },
          })
          .then((res1) => {
            dispatch(logIn(res.data.accessToken));
            return res1;
          });

        dispatch(
          setUser({
            email: userData.data.email,
            role: userData.data.role.name,
            loggedWith: userData.data.loggedWith,
            avatar: userData.data.profile.avatar,
            name: userData.data.profile.name,
            header: userData.data.profile.header,
            groupId: userData.data.userGroupAnalysisId,
          })
        );
      })
      .catch((error) => {
        dispatch(logOut());
        // console.error(error);
      });
  }

  return null;
}
