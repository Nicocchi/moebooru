import * as express from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { DatabaseInit } from "orm";
const imageDir = process.env.IMAGE_DIR!;
import { CheckAuthorization } from "middleware/verifyJWT";
import { logger } from "middleware/logEvents";
import { errorHandler } from "middleware/errorHandler";
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
import { credentials } from "middleware/credentials";
import { allowedOrigins } from "./config/allowedOrigins";
const cors = require("cors");
// const allowedOrigins = require('./config/allowedOrigins');

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
    
    this.app.use(cookieParser());

    // Cors
    const corsOptions = {
      origin: (origin: string, cb: Function) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
          cb(null, true);
        } else {
          cb(new Error("Not allowed by CORS"));
        }
      },
      optionsSuccessStatus: 200,
    };

    this.app.use(credentials);
    this.app.use(cors(corsOptions));

    this.app.use(errorHandler);
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
