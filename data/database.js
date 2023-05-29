import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "attendance",
    })
    .then(() => {
      console.log("Db is connected");
    })
    .catch(() => {
      console.log(e);
    });
};
