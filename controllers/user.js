import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { newLeave } from "./leaves.js";
import Leave from "../models/leaves.js";

export const userRegistration = async (req, res) => {
  console.log("inside signup");

  // getting the username, email and password from the body
  const { name, email, password } = req.body;

  try {
    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." }); // if
    }

    // If user doesn't exist , create a new user
    const hashedPassword = await bcrypt.hash(password, 12);

    // newUser database mein
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate one token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,

      { expiresIn: "1h" }
    );

    res.status(200).json({ result: newUser, token });

    res.json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

// this will show the all the users present in the users database
export const userData = async (req, res) => {
  const users = await UserModel.find({});
  console.log(req.query);

  res.json({
    success: true,
    users,
  });
};

// to get the data of user who applied for the leave
export const userOne = async (req, res) => {
  const { token } = req.cookies;

  const decoded = jwt.verify(token, "asdfgh");

  const leaveDetail = await Leave.findById(decoded._id);

  const user = await UserModel.findOne({ email: leaveDetail.email });

  console.log(user);

  res.redirect("/");
};
