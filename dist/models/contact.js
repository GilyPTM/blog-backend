"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.findOne = exports.findAll = void 0;
const db_1 = require("../db");
// Get all users
const findAll = (callback) => {
    const queryString = `SELECT * FROM contact`;
    db_1.db.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const contact_messages = [];
        rows.forEach((row) => {
            const contact_message = {
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
exports.findAll = findAll;
const findOne = (contactId, callback) => {
    const queryString = `SELECT * FROM contact WHERE id=?`;
    db_1.db.query(queryString, contactId, (err, result) => {
        if (err) {
            callback(err);
        }
        const row = result[0];
        const message = {
            id: row.id,
            firstName: row.nume,
            lastName: row.prenume,
            email: row.email,
            message: row.mesaj,
        };
        callback(null, message);
    });
};
exports.findOne = findOne;
const create = (contact, callback) => {
    //Verificam daca exista user cu aceasta adresa de email
    const queryString = "INSERT INTO contact (nume, prenume, email, mesaj) VALUES (?, ?, ?, ?)";
    console.log("insert", contact);
    try {
        db_1.db.query(queryString, [contact.firstName, contact.lastName, contact.email, contact.message], (err, result) => {
            if (result !== undefined) {
                const insertId = result.insertId;
                callback(null, insertId);
            }
            else {
                console.log("error email", err);
                //callback(err, 0);
            }
        });
    }
    catch (error) {
        callback(error);
    }
};
exports.create = create;
