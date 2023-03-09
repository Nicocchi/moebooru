import * as express from "express";
import { User } from "models/User";

class LogoutController {
  public path = "/logout";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.handleLogout);
  }

  handleLogout = async (_req: express.Request, res: express.Response) => {
    // Delete accessToken on client
    const cookies = _req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Check if refresh token is in db
    try {
      const user = await User.findOne({
        refreshToken,
      });

      if (!user) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.sendStatus(204);
      }

      // Delete refreshToken in db
      await user.updateOne({ refreshToken: "" });
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };
}

export default LogoutController;
