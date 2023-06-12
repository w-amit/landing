import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "attendance",
    })
    .then(() => {
      console.log("Db is connected");
    })
    .catch((e) => {
      console.log(e);
    });
};




//mongodb+srv://wamitwkumarw:flUUTicPN52XJPXg@firstdb.vuzorq1.mongodb.net/?retryWrites=true&w=majority

//mongodb+srv://Nikhilnv:Nikhil123@cluster0.8sg6hxc.mongodb.net

