import express from "express";
import mongoose from "mongoose";
// import nodemailer from "nodemailer";
import path from "path";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();

// using Middlewares
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "absent",
  })
  .then(() => {
    console.log("Db is connected");
  })
  .catch(() => {
    console.log(e);
  });

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

app.get("/", (req, res) => {
  res.send("Nioce");
});

app.get("/leave/all", async (req, res) => {
  const leaves = await Leave.find(); //finds every leave
  console.log(req.query);

  res.json({
    success: true,
    leaves,
  });
});

app.post("/leave/new", async (req, res) => {
  const { name, email, reason } = req.body;

  const user = await Leave.create({
    name,
    email,
    reason,
  });

  const token = jwt.sign({ _id: user._id }, "askjgsklas");

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Leave applied",
  });
});

// function processDocument(document) {
//   // Perform further operations using the document or its properties
//   // console.log("Processing document:", document.name);
// }

// app.get("/protected", () => async (req, res, next) => {
// const authHeader = req.headers.authorization;
// if (authHeader) {
//   const token = authHeader.split(" ")[1]; // Extract token value
//   console.log("Token:", token);
//   // Use the token as needed
//   next();
// } else {
//   res.status(401).json({ message: "Unauthorized" });
// }
// const decoded = jwt.verify(token, "askjgsklas");
// req.user = await User.findById(decoded._id);
// });

app.get("/leave/protected", async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    console.log("Token:", token);
    const decoded = jwt.verify(token, "askjgsklas");

    req.leave = await Leave.findById(decoded._id);

    if (req.leave.reason === "fever") {
      app.get("/add", async (req, res) => {
        hits++;
        res.status(200).send("Number of sick leave " + hits);
      });
    } else {
      console.log("Sick leave not added");
    }

    // Use the token for authentication or any other purpose
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

let hits = 0;
// Leave.findOne({ reason: "fever" })
//   .then((document) => {
//     if (document) {
//       if (document.reason === "fever") {
//         app.get("/add", async (req, res) => {
//           hits++;
//           res.status(200).send("Number of sick leave " + hits);
//         });
//       } else {
//         console.log("Sick leave not added");
//       }
//     } else {
//       console.log("No document found.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error finding document:", error);
//   });

app.listen(7000, () => {
  console.log("Server is running");
});
