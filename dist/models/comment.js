"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = exports.findAll = void 0;
const db_1 = require("../db");
const findAll = (postid, callback) => {
    const queryString = `SELECT comments.*, users.nume, users.prenume
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?;`;
    // @ts-ignore
    db_1.db.query(queryString, [postid], (err, result) => {
        if (err) {
            return callback(err); // Return the callback on error
        }
        const rows = result;
        const posts = [];
        rows.forEach((row) => {
            const post = {
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
exports.findAll = findAll;
const addComment = (comment, callback) => {
    const queryString = "INSERT INTO comments (id, text, post_id, user_id) VALUES (?, ?, ?, ?)";
    console.log(comment);
    try {
        const query = db_1.db.query(queryString, [comment.id, comment.text, comment.post_id, comment.user_id], 
        // @ts-ignore
        (err, result) => {
            if (err) {
                // Return the callback immediately when there is an error
                return callback(err);
            }
            if (result) {
                const insertId = result.insertId;
                // Return the insertId if the insert was successful
                return callback(null, insertId);
            }
            else {
                console.log("Error inserting comment");
                // Return 0 in case the insert was not successful, though this case should be rare
                return callback(null, 0);
            }
        });
        // Log the SQL query for debugging
        // @ts-ignore
        console.log(query.sql);
    }
    catch (error) {
        // Catch any unexpected errors and pass them to the callback
        callback(error);
    }
};
exports.addComment = addComment;
