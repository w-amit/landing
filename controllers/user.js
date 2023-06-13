import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CheckIn from "../models/checkIn.js";
import dotenv from "dotenv";

dotenv.config();

export const userRegistration = async (req, res) => {
  console.log("inside signup");
  // console.log(process.env.JWT_SECRET);

  // getting the username, email and password from the body
  const { name, email, password } = req.body;

  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." }); // if
    }

    // If user doesn't exist , create a new user
    const hashedPassword = await bcrypt.hash(password, 12);

    // newUser database mein
    const newUser = await User.create({
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

    // console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to check in
export const checkIn = async (req, res) => {
  // if some user try to check in through email
  const { email } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    const userId = user._id;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get the current date

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // console.log(currentDate);
    // console.log(currentTime);

    // Check if a check-in record exists for the user and current date
    const checkInRecord = await CheckIn.findOne({
      user: userId,
      date: currentDate,
    });

    if (checkInRecord) {
      return res
        .status(400)
        .json({ message: "User has already checked in for today." });
    }

    //if the user hasn't check in for today then create the new checkIn record as he is trying to checkIn
    // Create a new check-in record
    const newCheckInRecord = await CheckIn.create({
      user: userId,
      date: currentDate,
      checkInTime: currentTime,
      checkIn: true,
    });

    res.status(200).json({
      message: "Check-in successful.",
      checkInRecord: newCheckInRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to mark the user as absent if no check-in entry exists on a specific day and  update absent list and get total absent days

export const updateAbsent = async (req, res) => {
  // console.log("inside updateAbsent");

  // whenever the user signup then it will create a token and that token is used here for the updation of absent
  const { token } = req.cookies;

  const { email } = jwt.verify(token, process.env.JWT_SECRET);

  console.log(email);

  try {
    const user = await User.findOne({ email });
    const userId = user._id;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // console.log(currentDate);
    // console.log(currentTime);

    const checkInRecord = await CheckIn.findOne({
      user: userId,
      date: currentDate,
    });

    const checkInDeadline = new Date();
    checkInDeadline.setHours(10, 0, 0); // Set the deadline to 10:00 am

    // If a user doesn't checkIn before 10 am on a particular day he/she will be counted as absent

    if (currentTime > checkInDeadline.toLocaleTimeString()) {
      user.absent += 1;
      await user.save();
    } else if (checkInRecord) {
      return res
        .status(400)
        .json({ message: "User has already checked in for today." });
    }

    res.status(200).json({
      absent: user.absent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
