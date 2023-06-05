import Leave from "../models/leaves.js";
// import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const newLeave = async (req, res) => {
  const { name, email, leave, startDate, endDate, document } = req.body;

  const leaves = await Leave.create({
    name,
    email,
    leave,
    startDate,
    endDate,
    document,
  });

  // now we have to use the email and find it in the user's database
  // const user = await UserModel.findOne({ email: leaves.email });

  // we will get the user by finding it in the user's database

  const token = jwt.sign({ _id: leaves.email }, process.env.JWT_SECERT);
  

  res.cookie("token", token, {
    httpOnly: true,
    // expires: new Date(Date.now() + 600 * 1000),
  });

  res.json({
    success: true,
    message: "Leave applied",
  });
};


export const countAllLeaveForUser = async (req, res) => {
  const { token } = req.cookies;
  const { _id } = jwt.verify(token, process.env.JWT_SECERT);

  try {
    const counts = await Leave.aggregate([
      {
        $match: { email: _id },
      },
      {
        $group: {
          _id: null,
          leaves: {
            $push: {
              leaveName: "$leave",
              count: { $sum: 1 },
            },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          leaves: {
            $map: {
              input: {
                $setUnion: [
                  "$leaves.leaveName",
                  [
                    "Sick Leave Pending",
                    "Casual Leave Pending",
                    "Paternity Leave Pending",
                    "Social Cause Leave Pending",
                    "Anniversary Leave Pending",
                    "Birthday Leave Pending",
                    "Unpaid Casual Leave Pending",
                  ],
                ],
              },
              as: "leaveName",
              in: {
                leaveName: "$$leaveName",
                count: {
                  $cond: {
                    if: { $eq: [{ $indexOfArray: ["$leaves.leaveName", "$$leaveName"] }, -1] },
                    then: 0,
                    else: {
                      $arrayElemAt: [
                        "$leaves.count",
                        { $indexOfArray: ["$leaves.leaveName", "$$leaveName"] },
                      ],
                    },
                  },
                },
              },
            },
          },
          totalCount: 1,
        },
      },
    ]);

    if (counts.length === 0) {
      // No leaves found for the user
      res.status(200).send([]);
    } else {
      res.status(200).send(counts[0]);
    }
  } catch (error) {
    throw new Error("Error counting leave: " + error);
  }
};

