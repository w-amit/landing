import mongoose from "mongoose";

// Define the CheckIn schema
const checkInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Boolean,
    default: false,
  },
});

// Create the CheckIn model
const CheckIn = mongoose.model("CheckIn", checkInSchema);

export default CheckIn;
