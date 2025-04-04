"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { socket } from "@/socket/socket";
import { useDebounce } from "@/hook/useDebounce";
import { handleMessage } from "./handleMessage";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { fetchRegionData } from "@/queries/fetchRegionData";
import { useDispatch, useSelector } from "react-redux";
import HexMap from "./hexMap/hexMap";
import styles from "./styles.module.scss";
import MainData from "./info/mainData";
import SubData from "./info/subData";
import RepublicOfYakutia from "./info/republicOfYakutia";
import GigaChat from "./info/gigaChat";
import SlimData from "./info/slimData";
import { setLandmarks } from "@/store/landmarkSlice";
import { IAdminCenter, ILandmark } from "@/interfaces/landmark";
import { sortByRating } from "@/utils/sortByRating";
import { sortByCommentsLength } from "@/utils/sortByCommentsLength";
import api from "@/http/api";
import { useSearchParams } from "next/navigation";
import { setAdminCenter } from "@/store/adminSlice";
import { useMediaQuery } from "react-responsive";

function HexMapMenu(props: {
  initialLandmarkData: ILandmark[];
  initialAdminCenterData: IAdminCenter;
  hexMapRef: React.RefObject<HTMLDivElement>;
}) {
  const selectedRegion = useSelector(
    (state: RootState) => state.hexMap.selectedRegion
  );
  const searchParams = useSearchParams();
  const needRefetch = searchParams.get("needRefetch");
  const { initialLandmarkData, initialAdminCenterData, hexMapRef } = props;
  const dispatch = useDispatch();
  const [gigaText, setGigaText] = useState("");
  const gigaTextRef = useRef<HTMLDivElement | null>(null);
  const [isGigaFetching, setIsGigaFetching] = useState(false);
  const [isGigaError, setIsGigaError] = useState(false);
  const [bestLandmark, setBestLandmark] = useState(
    sortByRating(initialLandmarkData, "desc")
  );
  const catFilter = useSelector((state: RootState) => {
    return state.filters.categories;
  });
  const varFilter = useSelector((state: RootState) => {
    return state.filters.sortVariable;
  });
  const debounceCatFilter = useDebounce(catFilter, 1000);
  const debounceSelectedRegion = useDebounce(selectedRegion, 2000);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  // ================================

  const {
    data: regionData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["regionData"],
    initialData: {
      landmarks: initialLandmarkData,
      adminCenter: { ...initialAdminCenterData },
    },
    queryFn: () => fetchRegionData(selectedRegion, debounceCatFilter.join(",")),
    enabled: false,
  });

  // ================================

  useEffect(() => {
    if (!isFirstRender) {
      refetch();
      api.get(`/landmark/center/${selectedRegion}`).then((res) => {
        setBestLandmark(res.data.landmarks);
      });
    } else {
      setIsFirstRender(false);
      api.get(`/landmark/center/${selectedRegion}`).then((res) => {
        setBestLandmark(res.data.landmarks);
      });
    }
  }, [debounceCatFilter, selectedRegion]);

  useEffect(() => {
    if (needRefetch === "true") {
      refetch();
    }
  }, []);

  // ================================

  useEffect(() => {
    if (varFilter.group === "rating") {
      dispatch(
        setLandmarks(sortByRating(regionData.landmarks, varFilter.type))
      );
    } else {
      dispatch(
        setLandmarks(sortByCommentsLength(regionData.landmarks, varFilter.type))
      );
    }

    dispatch(setAdminCenter(regionData.adminCenter));
  }, [regionData, varFilter, dispatch]);

  // ================================

  useEffect(() => {
    socket.emit("giga", { adminCenterId: debounceSelectedRegion });
    setGigaText("");
    setIsGigaFetching(true);
    setIsGigaError(false);

    return () => {
      socket.off("giga");
      setIsGigaFetching(false);
    };
  }, [debounceSelectedRegion]);

  // ================================

  useEffect(() => {
    const onMessageHandler = (text: string) => {
      handleMessage({
        text,
        gigaTextRef,
        setGigaText,
        setIsGigaFetching,
        setIsGigaError,
      });
    };

    socket.on("message", onMessageHandler);

    return () => {
      socket.off("message", onMessageHandler);
    };
  }, []);

  return (
    <section
      ref={hexMapRef}
      className={styles.hex_map_menu}
      aria-label="Интерактивная карта и информация о региона Республики Саха Якутия"
    >
      <aside className={styles.slim_data}>
        <SlimData
          regionName={regionData?.adminCenter.name}
          isLoading={isLoading}
          isError={isError}
        />
      </aside>

      <article className={styles.hex_map_menu__map_container}>
        {useMemo(() => {
          return (
            <Suspense>
              <HexMap isGigaFetching={isGigaFetching} />
            </Suspense>
          );
        }, [isGigaFetching])}
      </article>

      <article className={styles.hex_map_menu__info_container}>
        {!isMobile && !isFirstRender ? (
          <section className={styles.info_container__main_data}>
            {selectedRegion === "ALL" ? (
              <RepublicOfYakutia
                data={{
                  landmarks: bestLandmark,
                  adminCenter: regionData.adminCenter,
                }}
                isLoading={isLoading}
                isError={isError}
              />
            ) : (
              <MainData
                data={{
                  landmarks: bestLandmark,
                  adminCenter: regionData.adminCenter,
                }}
                isLoading={isLoading}
                isError={isError}
              />
            )}
          </section>
        ) : null}

        <section className={styles.info_container__giga_chat}>
          <GigaChat
            text={gigaText}
            gigaTextRef={gigaTextRef}
            isFetching={isGigaFetching}
            isError={isGigaError}
          />
        </section>

        <section className={styles.info_container__sub_data}>
          <SubData data={regionData} isLoading={isLoading} />
        </section>
      </article>
    </section>
  );
}

export default HexMapMenu;
