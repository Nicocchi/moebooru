import * as express from "express";
import { User } from "models/User";
import mongoose from "mongoose";
import { CheckAuthorization } from "middleware/verifyJWT";
import { CompareSync, GenerateAccessToken, GenerateRefreshToken } from "utils";
const jwt = require("jsonwebtoken");

class RefreshTokenController {
  public path = "/refresh";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.handleRefreshToken);
  }

  handleRefreshToken = async (_req: express.Request, res: express.Response) => {
    const cookies = _req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
      const user = await User.findOne(
        {
          refreshToken,
        },
        { password: 0 }
      );

      if (!user) return res.sendStatus(403);

      // Evaluate JWT
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: Error, decoded: any) => {
          if (err || user.id !== decoded.id) return res.sendStatus(403);
          const roles = (<any>Object).values(user.roles);
          const accessToken = GenerateAccessToken({
            UserInfo: {
              id: user.id,
              username: user.username,
              roles,
            },
          });

          return res.status(200).send({ accessToken });
        }
      );

      return;
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };
}

export default RefreshTokenController;
