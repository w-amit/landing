import Leave from "../models/leaves.js";
// import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const newLeave = async (req, res) => {
  console.log("inside newleave");
  const { name, email, leave, isApproved, startDate, endDate, document } =
 
    req.body;

  const leaves = await Leave.create({
    name,
    email,
    leave,
    isApproved,
    startDate,
    endDate,
    document,
  });

  const token = jwt.sign({ _id: leaves.email }, process.env.JWT_SECRET);

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
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);

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
              count: { $sum: { $cond: ["$isApproved", 1, 0] } },
            },
          },
          totalCount: { $sum: { $cond: ["$isApproved", 1, 0] } },
        },
      },
      {
        $unwind: "$leaves",
      },
      {
        $group: {
          _id: "$leaves.leaveName",
          count: { $sum: "$leaves.count" },
          totalCount: { $first: "$totalCount" },
        },
      },
      {
        $group: {
          _id: null,
          leaves: {
            $push: {
              leaveName: "$_id",
              count: "$count",
            },
          },
          totalCount: { $first: "$totalCount" },
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




