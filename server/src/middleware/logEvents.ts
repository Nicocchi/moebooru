import * as express from "express"
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

export const logEvents = async (msg: string, logName: string) => {
  const date = new Date();
  const localDate = date.toLocaleDateString(
    "en-US"
  )
  const localTime = date.toLocaleTimeString("en-US")
  const dateTime = `${localDate}\t${localTime}`;
  const logItem = `${dateTime}\t${uuid()}\t${msg.replace(/\u001b\[.*?m/g, "")}\n`;
  console.log(`${msg.replace("\t", "")}\n`);
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
  logEvents(`\x1b[1m\x1b[32m${_req.method}\x1b[0m ${_req.headers.origin}\t${_req.url}`, 'reqLog.txt');
  next();
}