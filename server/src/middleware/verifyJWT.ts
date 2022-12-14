import * as express from "express";
// import { IAuthRequest } from "types/express";
import { ValidateToken } from "utils";

export function CheckAuthorization(
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const token = _req.headers["authorization"];
    if (!token?.startsWith("Bearer ")) return res.sendStatus(401);

    const user = ValidateToken(token);


    // Invalid token
    if (!user) {
        return res.sendStatus(403);
    }

    _req.user = user.UserInfo.username;
    _req.roles = user.UserInfo.roles
    next();
    return;
  }