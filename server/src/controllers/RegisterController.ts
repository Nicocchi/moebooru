import * as express from "express";
import { User } from "models/User";
import { Hash } from "utils";
import { Role } from "../models/Roles";

class RegisterController {
  public path = "/register";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.register);
  }

  register = async (_req: express.Request, res: express.Response) => {
    const { username, password, roles } = _req.body;

    if (!username || !password)
      return res.status(400).send("Username or password not given");

    const hashedPass = Hash(password);
    const getUsrRole = await Role.findOne({ name: "User" });

    let newRoles = {
      User: getUsrRole?._id,
    };

    if (roles && roles.length > 0) {
      for (let i = 0; i < roles.length; i++) {
        const element = roles[i];
        const role = await Role.findOne({ name: element });
        const rl = {
          ...newRoles,
          [element]: role?._id,
        };
        newRoles = rl;
      }
    }

    const newUser = {
      username,
      password: hashedPass,
      avatar: "",
      roles: newRoles,
    };

    try {
      const user = await User.create(newUser);

      if (!user) return res.status(500).send("Failed to create user");

      return res.status(200).send("User created successfully");
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export default RegisterController;
