import api from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { changeGroup } from "../handlers/changeGroup";
import { useDispatch } from "react-redux";

interface Props {
  groupId: number | null;
}

const variants = {
  hidden: {
    height: "0px",
  },
  visible: {
    height: "max-content",
  },
};

function SelectUserGroup({ groupId }: Props) {
  const {
    data: groups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userGroups"],
    queryFn: async () => api.get("/user/groups").then((res) => res.data),
  });
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(groupId);
  const userGroupId = groupId ? groupId : 0;

  useEffect(() => {
    if (userGroupId !== selectedGroup && selectedGroup) {
      changeGroup(selectedGroup, dispatch);
    }
  }, [selectedGroup]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.wrapper__label}>Роль</p>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : isError ? (
        <p>Ошибка</p>
      ) : (
        <div className={styles.wrapper__container}>
          <div
            className={
              isOpen
                ? styles["list__item-selected"]
                : styles["list__item-label"]
            }
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {
              groups.filter((group: any) => group.id === userGroupId)[0]
                .nameForUser
            }
            {isOpen && (
              <span
                className={styles.item__open_sub}
                onMouseEnter={() => setHoveredGroup(groupId)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                ?
              </span>
            )}
            {hoveredGroup === userGroupId && isOpen && (
              <div className={styles.item__sub}>
                {
                  groups.filter((group: any) => group.id === userGroupId)[0]
                    .description
                }
              </div>
            )}
          </div>

          <motion.ul
            className={styles.container__list}
            style={{
              overflow: isOpen ? "visible" : "hidden",
            }}
            transition={{ duration: 0.35, type: "spring" }}
            variants={variants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
          >
            {groups.map(
              (group: {
                id: number;
                name: string;
                nameForUser: string;
                description: string;
              }) =>
                group.id !== userGroupId ? (
                  <li
                    key={group.id}
                    className={styles.list__item}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setIsOpen(!isOpen);
                    }}
                  >
                    {group.nameForUser}
                    <span
                      className={styles.item__open_sub}
                      onMouseEnter={() => setHoveredGroup(group.id)}
                      onMouseLeave={() => setHoveredGroup(null)}
                    >
                      ?
                    </span>
                    {hoveredGroup === group.id && (
                      <div className={styles.item__sub}>
                        {group.description}
                      </div>
                    )}
                  </li>
                ) : null
            )}
          </motion.ul>
        </div>
      )}
    </div>
  );
}

export default SelectUserGroup;
