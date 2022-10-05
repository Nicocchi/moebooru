import * as express from "express";
import { User } from "models/User";
import { CompareSync, GenerateAccessToken, GenerateRefreshToken } from "utils";

class LoginController {
  public path = "/login";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.login);
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

      const accessToken = await GenerateAccessToken({
        id: user.id,
        username: user.username,
      });

      const refreshToken = await GenerateRefreshToken({
        id: user.id,
        username: user.username,
      });
      await user.updateOne({ refreshToken: refreshToken });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).send({ accessToken });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong", error });
    }
  };
}

export default LoginController;
