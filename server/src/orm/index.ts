import { connect } from "mongoose";
import { Hash } from "utils";
import { User } from "models/User";
import { Role } from "../models/Roles";

export const DatabaseInit = async () => {
  try {
    await connect(
      `${process.env.DB_MONGO_URL!}/${process.env.DB_MONGO_DB_NAME}`
    );
    console.log("Connection Mongo: OK");

    // Create default admin user
    // user details set in .env
    run().catch((err) => console.error(err));
  } catch (err) {
    throw new Error("Unable to connect to database: " + err);
  }
};

async function run() {
  await connect(`${process.env.DB_MONGO_URL}/${process.env.DB_MONGO_DB_NAME}`);

  // TODO: This doesn't prevent recreation of new old dbs if they already exist
  //       need to update for better way of handling these
  const usrRole = await Role.findOne({ name: "User" });
  const mdRole = await Role.findOne({ name: "User" });
  const admRole = await Role.findOne({ name: "User" });

  if (!usrRole || !mdRole || !admRole) {
    const userRole = new Role({
      name: "User",
    });
    const modRole = new Role({
      name: "Moderator",
    });
    const adminRole = new Role({
      name: "Admin",
    });

    await userRole.save();
    await modRole.save();
    await adminRole.save();
  }

  const user = await User.findOne({ admin: true });
  const getUsrRole = await Role.findOne({ name: "User"});
  const getAdminRole = await Role.findOne({ name: "Admin"});

  if (!user) {
    console.log("NEW USER")
    const password = Hash(process.env.USER_PASS || "changeme");

    const newUser = new User({
      username: "admin",
      roles: {
        "User": getUsrRole?._id,
        "Admin": getAdminRole?._id,
      },
      password: password,
      avatar: "",
    });
    await newUser.save();

    console.log(
      `Default user & roles created. Recommended to change user details after logging in.`
    );
  }
}
