import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import session, { Session } from "express-session";
import fileUpload from "express-fileupload";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";
import { adminRouter } from "./routes/adminRouter";
import { contactRouter } from "./routes/contactRouter";
import { commentRouter } from "./routes/commentRouter";
import { db } from "./db";

// import RedisStore from "connect-redis";
// import { createClient } from "redis"; // Redis client
dotenv.config();

db.connect();

const app: Express = express();

// // Redis Client Setup
// const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });

// redisClient.connect().catch(console.error);

app.use(
  cors({
    origin: ["https://blog-frontend-livid-one.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    // store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "default_secret", // Make sure this is set securely in production
    resave: false, // Prevents unnecessary session resaving
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      httpOnly: true, // Prevent client-side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "dist")));

app.use(fileUpload());
const port = process.env.PORT;

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);
app.use("/comments", commentRouter);
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server!!!!");
  //res.sendFile(path.join(__dirname + "/acasa.html"));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
