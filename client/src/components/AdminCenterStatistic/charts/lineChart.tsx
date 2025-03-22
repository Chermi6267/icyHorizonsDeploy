import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import styles from "../styles.module.scss";

interface Props {
  text: string;
  data: {
    adminCenterId: string;
    commentsCount: number;
    id: number;
    month: number;
    views: number;
    year: number;
  }[];
}

const months: { [key: number]: string } = {
  0: "Январь",
  1: "Февраль",
  2: "Март",
  3: "Апрель",
  4: "Май",
  5: "Июнь",
  6: "Июль",
  7: "Август",
  8: "Сентябрь",
  9: "Октябрь",
  10: "Ноябрь",
  11: "Декабрь",
};

function TouristFlow(props: Props) {
  const { data, text } = props;
  const preparedData = data.map((el) => {
    return {
      name: `${months[el.month]} ${el.year}`,
      value: ((el.views + el.commentsCount) / 2) * 10,
    };
  });

  const finalData =
    data.length <= 1
      ? [{ name: "0", value: 0 }, ...preparedData]
      : preparedData.reverse();

  return (
    <div className={styles.chart}>
      <h2 className={styles.chart__text}>{text}</h2>
      <ResponsiveContainer>
        <LineChart data={finalData}>
          <XAxis dataKey="name" stroke="white" />
          <YAxis stroke="white" />

          <Line type="bumpX" dataKey="value" stroke="#7653c8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TouristFlow;
