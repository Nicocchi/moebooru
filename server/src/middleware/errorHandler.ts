import * as express from "express";
import { logEvents } from "./logEvents";

export const errorHandler = (
  err: any,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};
