import "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./routes";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "https://phu-ui.noyonrahman.xyz",
    ],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

// application routes
app.use(router);

export default app;
