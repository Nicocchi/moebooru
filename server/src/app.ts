import * as express from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { DatabaseInit } from "orm";
const imageDir = process.env.IMAGE_DIR!;
import { CheckAuthorization } from "utils";
import { logger } from "middleware/logEvents";
import { errorHandler } from "middleware/errorHandler";
const cors = require("cors");

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any, port: number) {
    this.app = express.default();
    this.port = port;

    this.init();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(express.static(imageDir));

    // this.app.use(morgan("dev"));
    this.app.use(logger);
    // parse requests of content-type - application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // parse requests of content-type - application/json
    this.app.use(bodyParser.json());

    // Cors
    const whitelist = ["http://localhost:3000"];
    const corsOptions = {
      origin: (origin: string, cb: Function) => {
        if (whitelist.indexOf(origin) !== -1) {
          cb(null, true);
        } else {
          cb(new Error("Not allowed by CORS"));
        }
      },
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));

    this.app.use(errorHandler);

    this.app.all("*", (_req: express.Request, res: express.Response) => {
      res.status(404);
      if (_req.accepts("json")) {
        res.json({ error: "404 not found" });
      } else {
        res.type("txt").send("404 Not Found");
      }
    });
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router);
    });
  }

  private async init() {
    await DatabaseInit();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
