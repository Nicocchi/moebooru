import { connect } from "mongoose";
import { Hash } from "utils";
import { User } from "models/User";

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

  const user = await User.findOne({ admin: true });

  if (!user) {
    const password = Hash(process.env.USER_PASS || "changeme");

    const newUser = new User({
      username: "admin",
      admin: true,
      password: password,
      avatar: "",
    });
    await newUser.save();

    console.log(
      `Default user created. Recommended to change details after logging in.`
    );
  }
}
