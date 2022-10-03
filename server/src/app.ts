import * as express from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { DatabaseInit } from "orm";
const imageDir = process.env.IMAGE_DIR!;
import { CheckAuthorization } from "utils";

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
    
    this.app.use(morgan("dev"));
    // parse requests of content-type - application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // parse requests of content-type - application/json
    this.app.use(bodyParser.json());

    // Cors
    this.app.use((_req, res, next) => {
      res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS, DELETE, PUT"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
      );
      next();
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
