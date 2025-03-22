import { Pie, ResponsiveContainer, PieChart, Tooltip, Cell } from "recharts";
import styles from "../styles.module.scss";
import { useMediaQuery } from "react-responsive";

interface Props {
  data: {
    name: string;
    count: number;
  }[];
}

function UserGroupAnalysis(props: Props) {
  const { data } = props;
  const COLORS = ["#AA60C8", "#D69ADE", "#EABDE6", "#FFDFEF"];
  const isMobile = useMediaQuery({ maxWidth: 700 });

  return (
    <div className={styles.chart}>
      <h2 className={styles.chart__text}>Баланс пользователей</h2>
      {data.length !== 0 ? (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              className={styles.pie}
              dataKey="count"
              isAnimationActive={true}
              data={data}
              cx="50%"
              cy="50%"
              labelLine={{
                stroke: "#888",
                strokeWidth: 2,
              }}
              label={
                !isMobile
                  ? ({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      index,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius =
                        25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          className={styles.label}
                        >
                          {`${name} (${(percent * 100).toFixed(0)}%)`}
                        </text>
                      );
                    }
                  : undefined
              }
            >
              {data.map((entry, index) => (
                <Cell
                  className={styles.pie}
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ marginTop: "30px" }} className={styles.chart__text}>
          Данных нет
        </p>
      )}
    </div>
  );
}

export default UserGroupAnalysis;
