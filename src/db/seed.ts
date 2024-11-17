import mongoose from "mongoose";
import config from "../config";
import Admin from "../modules/admin/admin.model";
import { USER_ROLE } from "../modules/user/user.constant";
import User from "../modules/user/user.model";

const superUser = {
  id: "0001",
  email: config.super_admin_email,
  password: config.super_admin_pass,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isSuperAdminExits = await User.findOne({
      role: USER_ROLE.superAdmin,
    }).session(session);

    if (!isSuperAdminExits) {
      // Create super user
      const user = await User.create([superUser], { session });

      // Create admin related data
      await Admin.create(
        [
          {
            id: user[0].id,
            gender: "male",
            user: user[0]._id,
            designation: "Super Admin",
            name: {
              firstName: "Super",
              lastName: "Admin",
            },
            email: superUser.email,
            contactNo: "0000000000",
            emergencyContactNo: "0000000000",
            presentAddress: "Super Admin address",
            permanentAddress: "Super Admin address",
            profileImage:
              "https://glrealestatecoop.com/wp-content/uploads/2022/06/profile-avatar-340x340.png",
          },
        ],
        { session },
      );

      // Commit transaction
      await session.commitTransaction();

      // eslint-disable-next-line no-console
      console.log("Super admin user seeded successfully");
    } else {
      // eslint-disable-next-line no-console
      console.log("Super admin already exists");
    }
  } catch (error) {
    // If an error occurs, rollback the transaction
    await session.abortTransaction();

    // eslint-disable-next-line no-console
    console.error("Error seeding super admin:", error);
  } finally {
    // End session
    session.endSession();
  }
};

export default seedSuperAdmin;
