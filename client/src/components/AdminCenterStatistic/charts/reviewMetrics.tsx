import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import styles from "../styles.module.scss";
import { useMediaQuery } from "react-responsive";

interface Props {
  text: string;
  data: { name: string; value: number }[] | null;
}

const CustomYTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: any;
}) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={4}
      textAnchor="end"
      fill="white"
      fontSize={12}
      transform="rotate(-20)"
    >
      {payload.value}
    </text>
  </g>
);

function ReviewMetrics(props: Props) {
  const { data, text } = props;
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className={styles.chart}>
      <h2 className={styles.chart__text}>{text}</h2>
      {data ? (
        isMobile ? (
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical">
              <XAxis
                type="number"
                stroke="white"
                domain={[0, 5]}
                tick={{ fill: "white" }}
              />

              <YAxis
                type="category"
                dataKey="name"
                stroke="white"
                width={120}
                tick={CustomYTick}
              />

              <Bar
                dataKey="value"
                fill="#7653c8"
                barSize={25}
                animationDuration={750}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="white" />

              <YAxis
                dataKey="value"
                stroke="white"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />

              <Bar
                animationDuration={750}
                animationEasing="ease-in-out"
                dataKey="value"
                fill="#7653c8"
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      ) : (
        <p style={{ marginTop: "30px" }} className={styles.chart__text}>
          Данных нет
        </p>
      )}
    </div>
  );
}
export default ReviewMetrics;
