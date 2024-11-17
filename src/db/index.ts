import mongoose from "mongoose";
import config from "../config";
import seedSuperAdmin from "./seed";

const connectToDB = async () => {
  await mongoose
    .connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Connected to database".cyan);
    });

  await seedSuperAdmin();
};

export default connectToDB;
