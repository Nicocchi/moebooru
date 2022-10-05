import * as express from "express"
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

export const logEvents = async (msg: string, logName: string) => {
  const date = new Date();
  const dateTime = `${date.toLocaleDateString(
    "en-US"
  )}\t${date.toLocaleTimeString("en-US")}`;
  const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  logEvents(`${_req.method}\t${_req.headers.origin}\t${_req.url}`, 'reqLog.txt');
  next();
}