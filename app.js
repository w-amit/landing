import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "./data/database.js";
import cors from "cors";
import dotenv from "dotenv";
import { userData, userRegistration } from "./controllers/user.js";
import { newLeave, countAllLeaveForUser } from "./controllers/leaves.js";

const app = express();

// using Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// app.use(userRouter);

dotenv.config();

connectDB();

// for the home page of leave
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Leave Management System",
  });
});

app.post("/signup", userRegistration);

// user's new leave applied
app.post("/leave/new", newLeave);

// user's leave record
app.get("/leave/record", countAllLeaveForUser);

// to get the data of all user
app.get("/user/all", userData);


app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
