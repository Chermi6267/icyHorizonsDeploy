import Image from "next/image";
import Star from "@/components/svg/star";
import styles from "./styles.module.scss";
import { IComment } from "@/interfaces/landmark";

interface CommentsProps {
  comments: IComment[];
}

export function CommentList({ comments }: CommentsProps) {
  return (
    <ul className={styles.comment_cont__comments}>
      {comments.length > 0 ? (
        comments
          .slice()
          .reverse()
          .map((comment) => (
            <li key={comment.id} className={styles.comment}>
              <div className={styles.comment__name_rating_cont}>
                <div className={styles.name_rating_cont__user}>
                  <Image
                    src={comment.user.profile.avatar || "/user.png"}
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
                  <p className={styles.rating__text}>{comment.stars}</p>
                  <Star className={styles.rating__svg} />
                </div>
              </div>
              <p className={styles.comment__text}>{comment.text}</p>
            </li>
          ))
      ) : (
        <li className={styles.no_comments}>Отзывов пока что нет</li>
      )}
    </ul>
  );
}
