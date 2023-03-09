import { Request, Response, NextFunction } from "express";

export const verifyRoles = (...allowedRoles: any) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!_req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];

    const result = _req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);

    next();
    return;
  };
};
