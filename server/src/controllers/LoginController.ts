import * as express from "express";
import { User } from "models/User";
import { CompareSync, GenerateToken } from "utils";

class LoginController {
  public path = "/login";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.login);
  }

  login = async (_req: express.Request, res: express.Response) => {
    const { username, password } = _req.body;

    if (!username || !password)
      return res.status(400).send("Username or password not given");

    try {
      const user = await User.findOne({
        username,
      });

      if (!user) return res.status(400).send("Username or password incorrect");

      if (!CompareSync(password, user.password))
        return res.status(400).send("Username or password incorrect");

      const token = await GenerateToken({
        id: user.id,
        username: user.username,
      });

      return res.status(200).send({ token });
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export default LoginController;
