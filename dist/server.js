"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const userRouter_1 = require("./routes/userRouter");
const postRouter_1 = require("./routes/postRouter");
const adminRouter_1 = require("./routes/adminRouter");
const contactRouter_1 = require("./routes/contactRouter");
const commentRouter_1 = require("./routes/commentRouter");
const db_1 = require("./db");
// import RedisStore from "connect-redis";
// import { createClient } from "redis"; // Redis client
dotenv_1.default.config();
db_1.db.connect();
const app = (0, express_1.default)();
// // Redis Client Setup
// const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });
// redisClient.connect().catch(console.error);
// Session setup using Redis
app.use((0, express_session_1.default)({
    // store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "default_secret", // Make sure this is set securely in production
    resave: false, // Prevents unnecessary session resaving
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        httpOnly: true, // Prevent client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "dist")));
app.use((0, express_fileupload_1.default)());
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use("/users", userRouter_1.userRouter);
app.use("/posts", postRouter_1.postRouter);
app.use("/admin", adminRouter_1.adminRouter);
app.use("/contact", contactRouter_1.contactRouter);
app.use("/comments", commentRouter_1.commentRouter);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname + "/uploads")));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server!!!!");
    //res.sendFile(path.join(__dirname + "/acasa.html"));
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
