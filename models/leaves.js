import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  leave: {
    type: String,
    enum: [
      "Sick Leave Pending",
      "Casual Leave Pending",
      "Paternity Leave Pending",
      "Social Cause Leave Pending",
      "Anniversary Leave Pending",
      "Birthday Leave Pending",
      "Unpaid Casual Leave Pending",
    ],
    required: true,
  },
  
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  document: {
    type: String,
    required: false,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
