import { db } from "../db";
import { Comment } from "../types/Comment";
import { OkPacket, RowDataPacket } from "mysql2";

export const findAll = (
  postid: number,
  callback: (err: Error | null, comments?: Comment[]) => void
) => {
  const queryString = `SELECT comments.*, users.nume, users.prenume
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?;`;
  // @ts-ignore
  db.query(queryString, [postid], (err, result) => {
    if (err) {
      return callback(err); // Return the callback on error
    }

    const rows = <RowDataPacket[]>result;
    const posts: Comment[] = [];

    rows.forEach((row) => {
      const post: Comment = {
        id: row.id,
        text: row.text,
        post_id: row.post_id,
        user_id: row.user_id,
        nume: row.nume,
        prenume: row.prenume,
      };
      posts.push(post);
    });

    callback(null, posts); // Pass the posts array to the callback
  });
};

export const addComment = (
  comment: Comment,
  callback: (err: Error | null, insertId?: number) => void
) => {
  const queryString =
    "INSERT INTO comments (id, text, post_id, user_id) VALUES (?, ?, ?, ?)";

  console.log(comment);

  try {
    const query = db.query(
      queryString,
      [comment.id, comment.text, comment.post_id, comment.user_id],
      // @ts-ignore
      (err, result) => {
        if (err) {
          // Return the callback immediately when there is an error
          return callback(err);
        }

        if (result) {
          const insertId = (result as OkPacket).insertId;
          // Return the insertId if the insert was successful
          return callback(null, insertId);
        } else {
          console.log("Error inserting comment");
          // Return 0 in case the insert was not successful, though this case should be rare
          return callback(null, 0);
        }
      }
    );

    // Log the SQL query for debugging
    // @ts-ignore
    console.log(query.sql);
  } catch (error) {
    // Catch any unexpected errors and pass them to the callback
    callback(error as Error);
  }
};
