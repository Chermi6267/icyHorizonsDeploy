import { useState } from "react";
import styles from "./styles.module.scss";
import RatingStar from "./ratingStar";

interface Props {
  text: string;
  rating: number;
  setRating: (newValue: number) => void;
}

function SubRatingForm(props: Props) {
  const { text, rating, setRating } = props;
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleHover = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__rating} onMouseLeave={handleMouseLeave}>
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <RatingStar
              key={value}
              filled={value <= (hoverRating || rating)}
              onHover={() => handleHover(value)}
              onClick={() => handleClick(value)}
              value={value}
            />
          );
        })}
      </div>

      <p className={styles.container__text}>{text}</p>
    </div>
  );
}

export default SubRatingForm;
