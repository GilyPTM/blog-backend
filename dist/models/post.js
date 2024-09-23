"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPost = exports.deletePost = exports.addPost = exports.findOne = exports.findAllCategories = exports.findLast3 = exports.findAll = void 0;
const db_1 = require("../db");
// Get all posts
const findAll = (callback) => {
    const queryString = `SELECT * FROM posts`;
    db_1.db.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const posts = [];
        rows.forEach((row) => {
            const post = {
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
exports.findAll = findAll;
// Get all posts
const findLast3 = (callback) => {
    const queryString = `SELECT p.id,p.titlu,p.continut,p.poza, p.user_id,
  p.categorie_id, p.dataadaugare, c.nume 
  FROM posts p INNER JOIN categories c on p.categorie_id= c.id ORDER BY p.id DESC LIMIT 6`;
    db_1.db.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const posts = [];
        rows.forEach((row) => {
            const post = {
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
exports.findLast3 = findLast3;
const findAllCategories = (callback) => {
    const queryString = `SELECT * FROM categories`;
    db_1.db.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const categories = [];
        rows.forEach((row) => {
            const category = {
                id: row.id,
                nume: row.nume,
            };
            categories.push(category);
        });
        callback(null, categories);
    });
};
exports.findAllCategories = findAllCategories;
// Get one user
const findOne = (postId, callback) => {
    const queryString = `SELECT * FROM posts AS p INNER JOIN categories AS c ON p.categorie_id = c.id WHERE p.id=?`;
    db_1.db.query(queryString, postId, (err, result) => {
        if (err) {
            callback(err);
        }
        const row = result[0];
        const post = {
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
exports.findOne = findOne;
// create post
const addPost = (post, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = "INSERT INTO posts (titlu, continut, categorie_id, user_id, poza) VALUES (?, ?, ?, ?, ?)";
    console.log(post);
    try {
        // Promisify the db.query call to use async/await
        const result = yield new Promise((resolve, reject) => {
            db_1.db.query(queryString, [post.titlu, post.continut, post.categorie_id, post.user_id, post.poza], (err, result) => {
                if (err) {
                    return reject(err); // If error, reject the promise
                }
                resolve(result); // If success, resolve the promise
            });
        });
        // Log the SQL query for debugging
        console.log(result);
        // If result is valid, extract the insertId and call the callback
        if (result && result.insertId) {
            callback(null, result.insertId);
        }
        else {
            callback(null, 0); // Fallback if no insertId
        }
    }
    catch (error) {
        // Handle any errors that occur during the query execution
        callback(error);
    }
});
exports.addPost = addPost;
const deletePost = (id, callback) => {
    const queryString = "DELETE FROM posts WHERE id = ?";
    db_1.db.query(queryString, [id], (err, result) => {
        if (err) {
            return callback(err);
        }
        // Checking if a row was affected (i.e., a post was deleted)
        if (result) {
            callback(null, { message: "Post deleted successfully" });
        }
        else {
            callback(null, { message: "No post found with the given id" });
        }
    });
};
exports.deletePost = deletePost;
const editPost = (id, updatedData, callback) => {
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
    const queryString = `UPDATE posts SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    // Adding the ID to the list of values
    values.push(id);
    db_1.db.query(queryString, values, (err, result) => {
        if (err) {
            return callback(err);
        }
        // Checking if a row was affected (i.e., a post was updated)
        if (result) {
            callback(null, { message: "Post updated successfully" });
        }
        else {
            callback(null, { message: "No post found with the given id" });
        }
    });
};
exports.editPost = editPost;
