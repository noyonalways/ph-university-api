import "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./routes";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// application routes
app.use(router);

export default app;
