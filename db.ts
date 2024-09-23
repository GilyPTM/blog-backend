import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

// Create a connection pool
export const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PWD || "",
  database: process.env.DB_NAME || "mydatabase",
  port: Number(process.env.DB_PORT) || 3306,
});
