import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, trim: true },

    email: { type: String, trim: true },

    password: { type: String, trim: true },

    tc: { type: Boolean },
    
    // These leave_pending should be 0 by default and it is stored in the database when the user create the account

    Sick_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Casual_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Paternity_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Social_Cause_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Anniversary_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Birthday_Leave_Pending: {
      type: Number,
      default: 0,
    },
    Unpaid_Casual_Leave_Pending: {
      type: Number,
      default: 0,
    },
  }),

  
  UserModel = model("User", userSchema);

export default UserModel;
