"use client";

import Logo from "../svg/logo";
import styles from "./style.module.scss";
import { useState, useEffect, useMemo } from "react";
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import { logoutHandler } from "@/handlers/logoutHandler";
import { logOut } from "@/store/authSlice";
import { unsetUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import AuthHandler from "../auth/authHandler";
import Link from "next/link";

interface Props {}

function Header(props: Props) {
  const [isUserMenu, setIsUserMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { isAuth, user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 200);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const clientCondition = isAuth && isClient;
  const authHandlerMemo = useMemo(() => {
    return <AuthHandler />;
  }, []);

  return (
    <>
      {authHandlerMemo}
      <header
        className={`${styles.header} ${isVisible ? "" : styles.header_hidden}`}
        role="header"
      >
        <nav className={styles.header__nav}>
          <Link href="/" aria-label="Перейти на главную страницу">
            <div className={styles.header__logo_container}>
              <Logo className={styles.logo_container__svg} />
              <h1 className={styles.logo_container__text}>Icy Horizons</h1>
            </div>
          </Link>
        </nav>

        <nav className={styles.header__buttons_container}>
          <Link
            href={clientCondition ? "/profile" : "/auth"}
            aria-label="Перейти в профиль или выполнить вход"
          >
            <div className={styles.buttons_container__user}>
              <Image
                src={
                  clientCondition
                    ? user.avatar === "" || user.avatar === null
                      ? "/user.png"
                      : user.avatar
                    : "/user.png"
                }
                alt={
                  clientCondition
                    ? `Аватар пользователя ${user.name}`
                    : "Аватар пользователя"
                }
                fill
                sizes="width: 100%; height: 100%"
                className={`${styles.user__img} ${
                  clientCondition ? styles["user__img-auth"] : ""
                }`}
                role="img"
              />
              <div
                className={
                  isUserMenu
                    ? styles["user__info_wrapper-logout"]
                    : styles["user__info_wrapper-logout-hidden"]
                }
              >
                <div
                  className={styles.info_wrapper__container}
                  style={
                    !clientCondition
                      ? { color: "#a8cd9f" }
                      : { color: "#eb4335" }
                  }
                  onClick={() => {
                    if (clientCondition) {
                      logoutHandler();
                      dispatch(unsetUser());
                      dispatch(logOut());
                      localStorage.removeItem("token");
                    } else {
                      router.push("/auth");
                    }
                  }}
                >
                  <p className={styles.container__logout_text}>
                    {clientCondition ? "Выйти" : "Войти"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </nav>
      </header>
    </>
  );
}

export default Header;
