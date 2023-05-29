import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "./data/database.js";
import cors from "cors";
import dotenv from "dotenv";
import { userData, userOne, userRegistration } from "./controllers/user.js";
import { newLeave } from "./controllers/leaves.js";

const app = express();

// using Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
dotenv.config();

// app.use(userRouter);

connectDB();

// for the home page of leave
app.get("/", (req, res) => {
  res.send("Nice we are under leave page rough");
});

app.post("/signup", userRegistration);

// user's new leave applied
app.post("/leave/new", newLeave);

// to get the data of all user
app.get("/user/all", userData);

// to get the data of single user
app.get("/user/one", userOne);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
