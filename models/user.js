import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, trim: true },

    email: { type: String, trim: true },

    password: { type: String, trim: true },

    absent: {
      type: Number,
      default: 0,
    },

    tc: { type: Boolean },
  }),
  User = model("User", userSchema);

export default User;
