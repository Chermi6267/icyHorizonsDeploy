"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchLandmark } from "@/queries/fetchLandmark";
import NameRating from "@/components/landmark/nameRating";
import Slider from "@/components/slider/slider";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
import { commentHandler } from "@/handlers/commentHandler";
import { ratingHandler } from "@/handlers/ratingHandler";
import useAuth from "@/hook/useAuth";
import Star from "@/components/svg/star";
import StarRating from "@/components/landmark/starRating";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Link from "next/link";
import Arrow from "@/components/svg/arrow";
import { ILandmark } from "@/interfaces/landmark";
import dynamic from "next/dynamic";

interface Props {
  initialLandmarkData: ILandmark;
}

const DynamicMap = dynamic(() => import("@/components/map/map"), {
  ssr: false,
});

function LandmarkContent(props: Props) {
  const { initialLandmarkData } = props;
  const [needRefetch, setNeedRefetch] = useState(false);
  const { landmarkId } = useParams();
  const [commentText, setCommentText] = useState("");
  const { isAuth } = useAuth();
  const commentRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState([1, 1, 1, 1, 1]);
  const windowWidth = 12454;

  const {
    data: landmarkData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["landmarkData", landmarkId],
    queryFn: () => fetchLandmark(landmarkId.toString()),
    initialData: initialLandmarkData,
    enabled: false,
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <nav>
          <Link
            href={`/?needRefetch=${needRefetch}`}
            style={{
              width: "max-content",
              textDecoration: "none",
              color: "white",
            }}
          >
            <button className={styles.empty_btn}>
              <div className={styles.back_arrow}>
                <Arrow className={styles.back_arrow__svg} />
                <p className={styles.back_arrow__text}>Назад</p>
              </div>
            </button>
          </Link>
        </nav>

        {!isLoading && !isError && landmarkData ? (
          <>
            <Toaster position="bottom-center" />
            <section className={styles.landmark_main}>
              <div className={styles.landmark_main__text_cont}>
                <p>{landmarkData.description}</p>
              </div>

              <Slider
                className={styles.landmark_main__slider}
                images={landmarkData.landmarkPhoto}
              />
            </section>

            <NameRating landmarkData={landmarkData} />
            <DynamicMap
              cords={[
                parseFloat(landmarkData.latitude),
                parseFloat(landmarkData.longitude),
              ]}
              name={landmarkData.name}
            />

            <section className={styles.landmark_main__comment_cont}>
              <div role="form" className={styles.comment_cont__comment_input}>
                <div
                  onKeyDown={(e) =>
                    commentHandler(
                      e,
                      false,
                      commentText,
                      rating,
                      landmarkId,
                      refetch,
                      setNeedRefetch,
                      setCommentText,
                      commentRef,
                      isAuth,
                      windowWidth
                    )
                  }
                  className={styles.comment_input__input_field}
                  contentEditable
                  spellCheck="false"
                  onInput={(e) => {
                    if (e.currentTarget.innerText.trim().length > 200) {
                      alert("Слишком большой");
                      if (commentRef && commentRef.current) {
                        commentRef.current.innerText = "";
                      }
                    }
                    setCommentText(e.currentTarget.innerText.trim());
                  }}
                  ref={commentRef}
                />

                <div className={styles.comment_input__underline} />
                <StarRating
                  rating={rating}
                  ratingHandler={(n: number) =>
                    ratingHandler(rating, setRating, n)
                  }
                />

                <button
                  onClick={(e) => {
                    commentHandler(
                      e,
                      true,
                      commentText,
                      rating,
                      landmarkId,
                      refetch,
                      setNeedRefetch,
                      setCommentText,
                      commentRef,
                      isAuth,
                      windowWidth
                    );
                  }}
                  className={styles.comment_input__submit_btn}
                >
                  Отправить
                </button>
              </div>

              <ul className={styles.comment_cont__comments}>
                {landmarkData.comment.length > 0 ? (
                  landmarkData.comment
                    .slice()
                    .reverse()
                    .map((comment) => {
                      return (
                        <li key={comment.id} className={styles.comment}>
                          <div className={styles.comment__name_rating_cont}>
                            <div className={styles.name_rating_cont__user}>
                              <Image
                                src={
                                  comment.user.profile.avatar === null ||
                                  comment.user.profile.avatar === ""
                                    ? "/user.png"
                                    : comment.user.profile.avatar
                                }
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className={styles.user__avatar}
                              />
                              <h1 className={styles.user__name}>
                                {comment.user.profile.name}
                              </h1>
                            </div>
                            <div className={styles.name_rating_cont__rating}>
                              <p className={styles.rating__text}>
                                {comment.stars}
                              </p>
                              <Star className={styles.rating__svg} />
                            </div>
                          </div>
                          <p className={styles.comment__text}>{comment.text}</p>
                        </li>
                      );
                    })
                ) : (
                  <li className={styles.no_comments}>Отзывов пока что нет</li>
                )}
              </ul>
            </section>
          </>
        ) : (
          <p>{isError ? "Произошла ошибка" : "Подождите"}</p>
        )}
      </main>

      <Footer />
    </>
  );
}

export default LandmarkContent;
