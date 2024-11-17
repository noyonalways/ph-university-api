import { Server } from "http";
import app from "./app/app";
import config from "./config";
import connectToDB from "./db";

let server: Server;

async function main() {
  try {
    await connectToDB();

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
