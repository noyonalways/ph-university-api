import express from "express";
import cors from "cors";
import router from "./routes";
import "colors";
import morgan from "morgan";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// application routes
app.use(router);

export default app;
