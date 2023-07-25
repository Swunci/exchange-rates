import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || "8888",
  MONGODB_URL: process.env.MONGODB_URL,
};

export { config };
