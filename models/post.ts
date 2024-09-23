import { Post } from "./../types/Post";
import { Category } from "../types/Category";
import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
// Get all posts
export const findAll = (callback: Function) => {
  const queryString = `SELECT * FROM posts`;
  // @ts-ignore
  db.query(queryString, (err, result) => {
    if (err) {
      console.log("err " + queryString, err);
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const posts: Post[] = [];
    rows.forEach((row) => {
      const post: Post = {
        id: row.id,
        titlu: row.titlu,
        continut: row.continut,
        categorie_id: row.categorie_id,
        user_id: row.user_id,
        dataadaugare: row.dataadaugare,
        poza: row.poza,
      };
      posts.push(post);
    });
    callback(null, posts);
  });
};

// Get all posts
export const findLast3 = (callback: Function) => {
  const queryString = `SELECT p.id,p.titlu,p.continut,p.poza, p.user_id,
  p.categorie_id, p.dataadaugare, c.nume 
  FROM posts p INNER JOIN categories c on p.categorie_id= c.id ORDER BY p.id DESC LIMIT 6`;
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const posts: Post[] = [];
    rows.forEach((row) => {
      const post: Post = {
        id: row.id,
        titlu: row.titlu,
        continut: row.continut,
        categorie_id: row.categorie_id,
        user_id: row.user_id,
        dataadaugare: row.dataadaugare,
        poza: row.poza,
        categorie_nume: row.nume,
      };
      posts.push(post);
    });
    callback(null, posts);
  });
};
export const findAllCategories = (callback: Function) => {
  const queryString = `SELECT * FROM categories`;
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const categories: Category[] = [];
    rows.forEach((row) => {
      const category: Category = {
        id: row.id,
        nume: row.nume,
      };
      categories.push(category);
    });
    callback(null, categories);
  });
};
// Get one user
export const findOne = (postId: number, callback: Function) => {
  const queryString = `SELECT * FROM posts AS p INNER JOIN categories AS c ON p.categorie_id = c.id WHERE p.id=?`;
  // @ts-ignore
  db.query(queryString, postId, (err, result) => {
    if (err) {
      callback(err);
    }

    const row = (<RowDataPacket>result)[0];
    const post: Post = {
      id: row.id,
      titlu: row.titlu,
      continut: row.continut,
      categorie_id: row.categorie_id,
      user_id: row.user_id,
      dataadaugare: row.dataadaugare,
      poza: row.poza,
      categorie_nume: row.nume,
    };
    callback(null, post);
  });
};

// create post
export const addPost = async (post: Post, callback: Function) => {
  const queryString =
    "INSERT INTO posts (titlu, continut, categorie_id, user_id, poza) VALUES (?, ?, ?, ?, ?)";
  console.log(post);

  try {
    // Promisify the db.query call to use async/await
    const result: OkPacket = await new Promise((resolve, reject) => {
      db.query(
        queryString,
        [post.titlu, post.continut, post.categorie_id, post.user_id, post.poza],
        // @ts-ignore
        (err, result) => {
          if (err) {
            return reject(err); // If error, reject the promise
          }
          resolve(result as OkPacket); // If success, resolve the promise
        }
      );
    });

    // Log the SQL query for debugging
    console.log(result);

    // If result is valid, extract the insertId and call the callback
    if (result && result.insertId) {
      callback(null, result.insertId);
    } else {
      callback(null, 0); // Fallback if no insertId
    }
  } catch (error) {
    // Handle any errors that occur during the query execution
    callback(error);
  }
};

export const deletePost = (id: number, callback: Function) => {
  const queryString = "DELETE FROM posts WHERE id = ?";
  // @ts-ignore
  db.query(queryString, [id], (err, result) => {
    if (err) {
      return callback(err);
    }

    // Checking if a row was affected (i.e., a post was deleted)
    if (result) {
      callback(null, { message: "Post deleted successfully" });
    } else {
      callback(null, { message: "No post found with the given id" });
    }
  });
};

export const editPost = (
  id: number,
  updatedData: { title?: string; content?: string },
  callback: Function
) => {
  // Constructing the query string dynamically based on what fields need to be updated
  let fieldsToUpdate = [];
  let values = [];

  if (updatedData.title) {
    fieldsToUpdate.push("titlu = ?");
    values.push(updatedData.title);
  }

  if (updatedData.content) {
    fieldsToUpdate.push("continut = ?");
    values.push(updatedData.content);
  }

  if (fieldsToUpdate.length === 0) {
    return callback(null, { message: "No data provided for update" });
  }

  const queryString = `UPDATE posts SET ${fieldsToUpdate.join(
    ", "
  )} WHERE id = ?`;

  // Adding the ID to the list of values
  values.push(id);

  // @ts-ignore
  db.query(queryString, values, (err, result) => {
    if (err) {
      return callback(err);
    }

    // Checking if a row was affected (i.e., a post was updated)
    if (result) {
      callback(null, { message: "Post updated successfully" });
    } else {
      callback(null, { message: "No post found with the given id" });
    }
  });
};
