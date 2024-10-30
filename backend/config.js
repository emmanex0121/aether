import dotenv from "dotenv";

dotenv.config();
export default {
  port: process.env.PORT || 8001,
  connectionstring: process.env.CONNECTION_STRING,
  jwtsecret: process.env.JWT_SECRET,
};
 