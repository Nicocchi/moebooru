import * as express from "express";

class RootController {
  public path = "/";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.root);
  }

  root = async (_req: express.Request, res: express.Response) => {
    
    return res.status(200).send("Hi");
  };
}

export default RootController;
