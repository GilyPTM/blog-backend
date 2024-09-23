import { Contact } from "./../types/Contact";
import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
// Get all users
export const findAll = (callback: Function) => {
  const queryString = `SELECT * FROM contact`;
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const contact_messages: Contact[] = [];
    rows.forEach((row) => {
      const contact_message: Contact = {
        id: row.id,
        firstName: row.nume,
        lastName: row.prenume,
        email: row.email,
        message: row.mesaj,
      };
      contact_messages.push(contact_message);
    });
    callback(null, contact_messages);
  });
};

export const findOne = (contactId: number, callback: Function) => {
  const queryString = `SELECT * FROM contact WHERE id=?`;
  db.query(queryString, contactId, (err, result) => {
    if (err) {
      callback(err);
    }

    const row = (<RowDataPacket>result)[0];
    const message: Contact = {
      id: row.id,
      firstName: row.nume,
      lastName: row.prenume,
      email: row.email,
      message: row.mesaj,
    };
    callback(null, message);
  });
};

export const create = (contact: Contact, callback: Function) => {
  //Verificam daca exista user cu aceasta adresa de email
  const queryString =
    "INSERT INTO contact (nume, prenume, email, mesaj) VALUES (?, ?, ?, ?)";
  console.log("insert", contact);
  try {
    db.query(
      queryString,
      [contact.firstName, contact.lastName, contact.email, contact.message],
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
};
