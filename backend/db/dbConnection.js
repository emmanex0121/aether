import mongoose from "mongoose";
import config from "../config.js";

export default () => {
  mongoose
    .connect(config.connectionstring)
    .then(() => {
      console.log("Database connection success");
    })
    .catch((error) => {
      console.error("Database connection failed", error);
    });
};
 