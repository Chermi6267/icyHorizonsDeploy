import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutHandler } from "@/handlers/logoutHandler";
import { changeNameHandler } from "./handlers/changeName";
import { changeAvatarHandler } from "./handlers/changeAvatar";
import { changeHeaderHandler } from "./handlers/changeHeader";
import { IUser, unsetUser } from "@/store/userSlice";
import { Toaster } from "react-hot-toast";
import { logOut } from "@/store/authSlice";
import ImageCropper from "@/components/imageCropper/imageCropper";

interface Props {
  user: IUser;
}

function Profile({ user }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const nameRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [imageCropperFormat, setImageCropperFormat] = useState(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.innerText = user.name || "Ваше имя";
    }
  }, [user]);

  const handleNameChange = () => {
    if (nameRef.current) {
      changeNameHandler(
        nameRef.current.innerText,
        user.name,
        nameRef,
        dispatch
      );
    }
  };

  const handleAvatarChange = async () => {
    if (avatarInputRef.current?.files) {
      setImageCropperFormat(1);
      const file = avatarInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const handleHeaderChange = () => {
    if (headerInputRef.current?.files) {
      setImageCropperFormat(21 / 9);
      const file = headerInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const handleCropComplete = (file: File) => {
    if (imageCropperFormat == 1) {
      changeAvatarHandler(file, dispatch, avatarInputRef);
    } else {
      changeHeaderHandler(file, dispatch, headerInputRef);
    }
    setImageSrc(null);
  };

  return (
    <>
      <div
        style={imageSrc ? { opacity: 0 } : { opacity: 1 }}
        className={styles.profile}
      >
        <div
          className={styles.profile__header_avatar}
          style={
            {
              backgroundImage: `url(${
                user.header === "" || user.header === null
                  ? "/userHeader.png"
                  : user.header
              })`,
              "--avatar-url": `url(${
                user.avatar === "" || user.avatar === null
                  ? "/user.png"
                  : user.avatar
              })`,
            } as React.CSSProperties
          }
        >
          <div
            onClick={() => {
              if (headerInputRef && headerInputRef.current) {
                headerInputRef.current.click();
              }
            }}
            className={styles.profile__header_input}
          />
          <input
            ref={headerInputRef}
            type="file"
            name="header"
            id="header"
            hidden
            onChange={handleHeaderChange}
          />

          <div
            onClick={() => {
              if (avatarInputRef && avatarInputRef.current) {
                avatarInputRef.current.click();
              }
            }}
            className={styles.profile__avatar_input}
          />
          <input
            ref={avatarInputRef}
            type="file"
            name="avatar"
            id="avatar"
            hidden
            onChange={handleAvatarChange}
          />
        </div>

        <div className={styles.profile__name_cont}>
          <div
            onBlur={() => {
              handleNameChange();
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                e.preventDefault();
                if (nameRef && nameRef.current) {
                  nameRef.current.blur();
                }
              }
            }}
            ref={nameRef}
            className={styles.profile__name}
            contentEditable
            spellCheck="false"
            id="nameInput1"
          />
          <label
            htmlFor="nameInput1"
            onClick={() => {
              if (nameRef && nameRef.current) {
                nameRef.current.focus();
              }
            }}
          >
            ✎
          </label>
        </div>

        <p spellCheck="false" className={styles.profile__email}>
          {user.email === "" ? "Ваше почта" : user.email}
        </p>

        <button
          className={styles.profile__logout_btn}
          onClick={() => {
            logoutHandler()
              .then((res) => {
                localStorage.removeItem("token");
                dispatch(unsetUser());
                dispatch(logOut());
                console.log("LOGOUT");
                router.push("/");
              })
              .catch((error) => {});
          }}
        >
          ВЫЙТИ
        </button>
      </div>

      {imageSrc && (
        <ImageCropper
          format={imageCropperFormat}
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setImageSrc(null);
            avatarInputRef.current!.value = "";
            headerInputRef.current!.value = "";
          }}
        />
      )}

      <Toaster position="bottom-center" />
    </>
  );
}

export default Profile;
