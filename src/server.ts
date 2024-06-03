import { Server } from "http";
import mongoose from "mongoose";
import app from "./app/app";
import config from "./config";

let server: Server;

async function main() {
  try {
    await mongoose
      .connect(config.database_url as string, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Connected to database".cyan);
      });

    server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Server is listening on http://localhost:${config.port}`.green,
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

main();

// handle unhandledRejection
process.on("unhandledRejection", () => {
  // eslint-disable-next-line no-console
  console.log(`❌ unhandledRejection is detected, shutting down the server...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle uncaughtException
process.on("uncaughtException", () => {
  // eslint-disable-next-line no-console
  console.log(`❌ uncaughtException is detected, shutting down the server...`);
  process.exit(1);
});
