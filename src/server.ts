import http from "http";
import mongoose from "mongoose";
import app from "./app/app";
import config from "./config";

const server = http.createServer(app);

async function main() {
  await mongoose
    .connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Connected to database".cyan);
    });

  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on http://localhost:${config.port}`.green);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
