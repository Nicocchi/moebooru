import { Request, Response, NextFunction } from "express";
const allowedOrigins = require("../config/allowedOrigins");

export const credentials = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = _req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
};
