"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchLandmark } from "@/queries/fetchLandmark";
import NameRating from "@/components/landmark/nameRating";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ILandmark } from "@/interfaces/landmark";
import dynamic from "next/dynamic";
import BackButton from "./backButton/backButton";
import SliderDescription from "./sliderDescription";
import { CommentList } from "./commentList";
import CommentInput from "./commentInput/commentInput";
import CommentForm from "./commentForm/commentForm";

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
        <BackButton href={`/?needRefetch=${needRefetch}`} />

        {!isLoading && !isError && landmarkData ? (
          <>
            <SliderDescription landmarkData={landmarkData} />
            <NameRating landmarkData={landmarkData} />
            <DynamicMap
              cords={[
                parseFloat(landmarkData.latitude),
                parseFloat(landmarkData.longitude),
              ]}
              name={landmarkData.name}
            />

            <section className={styles.landmark_main__comment_cont}>
              <CommentForm
                landmarkId={landmarkId}
                refetch={refetch}
                setNeedRefetch={(value: boolean) => setNeedRefetch(value)}
              />

              <CommentList comments={landmarkData.comment} />
            </section>

            <Toaster position="bottom-center" />
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
