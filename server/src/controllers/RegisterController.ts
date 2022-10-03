import * as express from "express";
import { User } from "models/User";
import { Hash } from "utils";

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
    const { username, password, admin } = _req.body;

    if (!username || !password)
      return res.status(400).send("Username or password not given");

    const hashedPass = Hash(password);

    const newUser = {
        username,
        password: hashedPass,
        avatar: "",
        admin: admin || false,
    }

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
