import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/not-found.js";
import { authRouter } from "./routes/auth.routes.js";
import { leadRouter } from "./routes/lead.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok"
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);

app.use(notFound);
app.use(errorMiddleware);
