import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import { connectDb } from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from 'morgan'
import path from 'path'
import { corsOptions } from "./config/corsOptions.js";


const app = express();

connectDb();

app.use(express.json({limit: "1mb"}));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan('dev'))

const __dirname = path.resolve()

app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});


const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode
  })
})

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
