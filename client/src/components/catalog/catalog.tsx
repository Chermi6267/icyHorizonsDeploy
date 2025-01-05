import { useState } from "react";
import CatalogItems from "./catalogItems";
import FiltersMenu from "./filterMenu/filtersMenu";
import SearchAndFiltersMenu from "./filterMenu/searchAndFiltersMenu";
import SearchMenu from "./searchMenu/searchMenu";
import styles from "./styles.module.scss";
import { IAdminCenter, ICategory, ILandmark } from "@/interfaces/landmark";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useWindowWidth from "@/hook/useWindowWidth";

interface Props {
  initialLandmarkData: ILandmark[];
  initialAdminCenterData: IAdminCenter;
  categories: ICategory[];
  hexMapRef: React.RefObject<HTMLDivElement>;
}

function Catalog(props: Props) {
  const { initialLandmarkData, initialAdminCenterData, categories, hexMapRef } =
    props;
  const [isActive, setIsActive] = useState(false);
  const innerWidth = useWindowWidth(1024);

  const sortVariables = {
    variables: [
      {
        id: "124afasdfqwe",
        name: "Лучший рейтинг",
        type: "desc" as "desc",
        group: "rating" as "rating",
      },
      {
        id: "2agdfDSGsga2",
        name: "Худший рейтинг",
        type: "asc" as "asc",
        group: "rating" as "rating",
      },

      {
        id: "asfd2314affdad",
        name: "Больше отзывов",
        type: "desc" as "desc",
        group: "comment" as "comment",
      },
      {
        id: "qwetwqtegc23e54adsfg",
        name: "Меньше отзывов",
        type: "asc" as "asc",
        group: "comment" as "comment",
      },
    ],
  };

  const adminCenter = useSelector((state: RootState) => {
    return state.adminCenter.name;
  });

  return (
    <div className={styles.catalog_wrapper}>
      <div className={styles.catalog_wrapper__filters_menu}>
        <FiltersMenu
          data={{
            selectedRegion: adminCenter,
            categories: categories,
          }}
          hexMapRef={hexMapRef}
          setIsActive={() => setIsActive(!isActive)}
        />
      </div>

      <div className={styles.catalog_wrapper__main_catalog}>
        {innerWidth >= 1023 ? (
          <SearchMenu data={sortVariables} hexMapRef={hexMapRef} />
        ) : (
          <SearchAndFiltersMenu
            hexMapRef={hexMapRef}
            data1={sortVariables}
            data2={{
              selectedRegion: adminCenter,
              categories: categories,
            }}
          />
        )}

        <CatalogItems initialData={initialLandmarkData} />
      </div>
    </div>
  );
}

export default Catalog;
