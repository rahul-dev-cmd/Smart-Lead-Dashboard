import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production"
  });
  console.info("MongoDB connection established");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
