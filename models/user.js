import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, trim: true },

    email: { type: String, trim: true },

    password: { type: String, trim: true },

    tc: { type: Boolean },
  }),

  UserModel = model("User", userSchema);

export default UserModel;
