import { Request, Response, Router } from "express";
import { CheckAuthorization } from "middleware/verifyJWT";
import { Tag } from "models/Tags";

class TagController {
  public path = "/tags";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, CheckAuthorization, this.getTag);
  }

  getTag = (_req: Request, res: Response) => {
    console.log(_req.user);
    if (!_req.query.tags) return res.status(200).send([]);
      Tag.find(
        { name: { $regex: _req.query.tags, $options: "i" } },
        (err: Error, doc: any) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Sorry, something went wrong");
          }
          return res.status(200).send(doc);
        }
      );
    return;
  };
}

export default TagController;
