import { useDebounce } from "@/hook/useDebounce";
import api from "@/http/api";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.scss";
import TouristFlow from "./charts/lineChart";
import UserGroupAnalysis from "./charts/userGroupAnalysis";
import ReviewMetrics from "./charts/reviewMetrics";

interface Props {}

interface ITouristFlowData {
  id: number;
  views: number;
  commentsCount: number;
  month: number;
  year: number;
  adminCenterId: string;
}

interface IReviewMetrics {
  id: number;
  adminCenterId: string;
  commentsCount: number;
  sumOfAccessibility: number;
  sumOfImprovement: number;
  sumOfTourismInfrastructure: number;
}

interface IUserGroupAnalysis {
  id: number;
  count: number;
}

interface IGroup {
  id: number;
  description: string;
  nameForUser: string;
  name: string;
}

interface AdminCenterStatisticResponse {
  touristFlow: ITouristFlowData[];
  userGroupAnalysis: IUserGroupAnalysis[];
  reviewMetrics: IReviewMetrics;
}

function AdminCenterStatistic(props: Props) {
  const {} = props;

  const selectedRegion = useSelector(
    (state: RootState) => state.hexMap.selectedRegion
  );
  const nameSelectedRegion = useSelector(
    (state: RootState) => state.adminCenter.name
  );
  const debounceSelectedRegion = useDebounce(selectedRegion, 1500);
  const [isOpen, setIsOpen] = useState(true);

  const { data: groups } = useQuery({
    queryKey: ["userGroups"],
    queryFn: async () => api.get("/user/groups").then((res) => res.data),
  });

  const { data: statistics, refetch } = useQuery<AdminCenterStatisticResponse>({
    queryKey: ["adminCenterStatistic", selectedRegion],
    queryFn: async () =>
      api
        .get<AdminCenterStatisticResponse>(
          `/landmark/center/statistics/${selectedRegion}`
        )
        .then((res) => res.data),
    enabled: !!selectedRegion,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (debounceSelectedRegion) {
      refetch();
    }
  }, [debounceSelectedRegion, refetch]);

  if (!statistics || !groups) {
    return null;
  }

  const userGroupAnalysisData = groups
    .map((group: IGroup) => {
      const found = statistics.userGroupAnalysis.find(
        (el) => el.id === group.id
      );
      const count = found ? found.count ** 2 : 0;
      return count > 0 ? { name: group.name, count } : null;
    })
    .filter(Boolean);

  const reviewMetricsData = statistics.reviewMetrics
    ? [
        {
          name: "Доступность",
          value:
            statistics.reviewMetrics.sumOfAccessibility /
            statistics.reviewMetrics.commentsCount,
        },
        {
          name: "Благоустройство",
          value:
            statistics.reviewMetrics.sumOfImprovement /
            statistics.reviewMetrics.commentsCount,
        },
        {
          name: "Инфраструктура",
          value:
            statistics.reviewMetrics.sumOfTourismInfrastructure /
            statistics.reviewMetrics.commentsCount,
        },
      ]
    : null;

  return selectedRegion !== "ALL" ? (
    <>
      <div className={styles.open_button_container}>
        <button
          className={styles.open_button_container__btn}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Скрыть статистику" : "Показать статистику"}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className={styles.container}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <article className={styles.container__item}>
              <TouristFlow
                text={`Туристическая активность — ${nameSelectedRegion}`}
                data={statistics.touristFlow}
              />
            </article>
            <article className={styles.container__item}>
              <div className={styles.item__sub}>
                <ReviewMetrics
                  text={`Оценка достопримечательностей — ${nameSelectedRegion}`}
                  data={reviewMetricsData}
                />
              </div>
              <div className={styles.item__sub}>
                <UserGroupAnalysis data={userGroupAnalysisData} />
              </div>
            </article>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  ) : (
    <p className={styles.text_info}>
      Выберите район на карте, чтобы увидеть его статистику
    </p>
  );
}

export default AdminCenterStatistic;
