import { User } from "./../types/User";
import { db } from "../db";
import bcryptjs from "bcryptjs";
import { OkPacket, RowDataPacket } from "mysql2";
// Get all users
export const findAll = (callback: Function) => {
  const queryString = `SELECT * FROM users`;

  // @ts-ignore
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const users: User[] = [];
    rows.forEach((row) => {
      const user: User = {
        id: row.id,
        nume: row.nume,
        prenume: row.prenume,
        email: row.email,
        parola: row.parola,
      };
      users.push(user);
    });
    callback(null, users);
  });
};
// Get one user
export const findOne = (userId: number, callback: Function) => {
  const queryString = `SELECT * FROM users WHERE id=?`;

  // @ts-ignore
  db.query(queryString, userId, (err, result) => {
    if (err) {
      callback(err);
    }

    const row = (<RowDataPacket>result)[0];
    const user: User = {
      id: row.id,
      nume: row.nume,
      prenume: row.prenume,
      email: row.email,
      parola: row.parola,
    };
    callback(null, user);
  });
};
// create user
export const create = (user: User, callback: Function) => {
  //Verificam daca exista user cu aceasta adresa de email
  const sql = "SELECT * FROM users WHERE email = ?";

  // @ts-ignore
  db.query(sql, [user.email], (err, result) => {
    const row = (<RowDataPacket>result)[0];
    if (row !== null && row !== undefined) {
      callback("User already exists!." + err?.message);
    } else {
      const queryString =
        "INSERT INTO users (nume, prenume, email, parola) VALUES (?, ?, ?, ?)";
      console.log("insert", user);
      let saltRounds = bcryptjs.genSaltSync(10);
      let password_hash = bcryptjs.hashSync(user.parola!, saltRounds);
      try {
        db.query(
          queryString,
          [user.nume, user.prenume, user.email, password_hash],
          // @ts-ignore
          (err, result) => {
            if (<OkPacket>result !== undefined) {
              const insertId = (<OkPacket>result).insertId;
              callback(null, insertId);
            } else {
              console.log("error email", err);
              //callback(err, 0);
            }
          }
        );
      } catch (error) {
        callback(error);
      }
    }
  });
};

// update user
export const updateUser = (userId: number, user: User, callback: Function) => {
  let queryString = `UPDATE users SET nume=?, prenume=?, email=? WHERE id=?`;
  let queryParams = [user.nume, user.prenume, user.email, userId];

  if (user.parola) {
    // Dacă parola este modificată, o criptăm din nou
    let saltRounds = bcryptjs.genSaltSync(10);
    let password_hash = bcryptjs.hashSync(user.parola!, saltRounds);
    queryString = `UPDATE users SET nume=?, prenume=?, email=?, parola=? WHERE id=?`;
    queryParams = [user.nume, user.prenume, user.email, password_hash, userId];
  }
  // @ts-ignore
  db.query(queryString, queryParams, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null);
  });
};

// delete user
export const deleteUser = (user: number, callback: Function) => {
  console.log(user);
  const queryString = `DELETE FROM users WHERE id=?`;
  // @ts-ignore
  db.query(queryString, [user], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null);
  });
};

//login  example
export const veifyPassword = (user: User, callback: Function) => {
  const queryString = `SELECT id, nume, prenume, email, parola from users where email=? LIMIT 1;`;
  const passwordUser = user.parola;
  // @ts-ignore
  db.query(queryString, [user.email], (err, result) => {
    if (err) {
      callback(err);
    }
    if ((result as any).length == 1) {
      const row = (<RowDataPacket>result)[0];
      var password_hash = row.parola;
      const verified = bcryptjs.compareSync(passwordUser!, password_hash);
      if (verified) {
        const user: User = {
          id: row.id,
          nume: row.nume,
          prenume: row.prenume,
          email: row.email,
          parola: row.parola,
        };
        callback(null, user);
      } else {
        console.log("Password doesn't match!");
        callback("Invalid Password!" + err?.message);
      }
    } else {
      callback("User Not found." + err?.message);
    }
  });
};
