import Leave from "../models/leaves.js";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const newLeave = async (req, res) => {
  const { name, email, leave, startDate, endDate} = req.body;

  const leaves = await Leave.create({
    name,
    email,
    leave,
    startDate, 
    endDate,
  });

  // now we have to use the email and find it in the user's database
  const user = await UserModel.findOne({ email: leaves.email }); // we will get the user by finding it in the user's database

  const token = jwt.sign({ _id: leaves._id }, process.env.JWT_SECERT);

  // Whenever the user apply for the leave, the leave will match the leave database and update it
  updateLeave(user, token);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 300 * 1000),
  });

  res.json({
    success: true,
    message: "Leave applied",
  });
};

const updateLeave = async (user, token) => {
  console.log("we are inside updateLeave");

  console.log(user);

  const decoded = jwt.verify(token, process.env.JWT_SECERT);

  const leaveDetail = await Leave.findById(decoded._id);

  const leave = leaveDetail.leave;

  if (leave === "Sick_Leave_Pending") {
    user.Sick_Leave_Pending = user.Sick_Leave_Pending + 1;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Sick_Leave_Pending: user.Sick_Leave_Pending }
    );

    console.log("Number of Sick_Leave_Pending : " + user.Sick_Leave_Pending);
  } else if (leave === "Casual_Leave_Pending") {
    user.Casual_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Casual_Leave_Pending: user.Casual_Leave_Pending }
    );

    console.log(
      "Number of Casual_Leave_Pending : " + user.Casual_Leave_Pending
    );
  } else if (leave === "Paternity_Leave_Pending") {
    user.Paternity_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Paternity_Leave_Pending: user.Paternity_Leave_Pending }
    );

    console.log(
      "Number of Paternity_Leave_Pending : " + user.Paternity_Leave_Pending
    );
  } else if (leave === "Social_Cause_Leave_Pending") {
    user.Social_Cause_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Social_Cause_Leave_Pending: user.Social_Cause_Leave_Pending }
    );

    console.log(
      "Number of Social_Cause_Leave_Pending : " +
        user.Social_Cause_Leave_Pending
    );
  } else if (leave === "Anniversary_Leave_Pending") {
    user.Anniversary_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Anniversary_Leave_Pending: user.Anniversary_Leave_Pending }
    );

    console.log(
      "Number of  Anniversary_Leave_Pending : " + user.Anniversary_Leave_Pending
    );
  } else if (leave === "Birthday_Leave_Pending") {
    user.Birthday_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Birthday_Leave_Pending: user.Birthday_Leave_Pending }
    );

    console.log(
      "Number of Birthday_Leave_Pending : " + user.Birthday_Leave_Pending
    );
  } else if (leave === "Unpaid_Casual_Leave_Pending") {
    user.Unpaid_Casual_Leave_Pending++;

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Unpaid_Casual_Leave_Pending: user.Unpaid_Casual_Leave_Pending }
    );

    console.log(
      "Number of Unpaid_Casual_Leave_Pending : " +
        user.Unpaid_Casual_Leave_Pending
    );
  } else {
    console.log("Leave not added");
  }

  console.log(user);
};
