import * as express from "express";
import { User } from "models/User";
import mongoose from "mongoose";
import { CheckAuthorization } from "utils";

class UsersController {
  public path = "/users";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, CheckAuthorization, this.getUser);
  }

  getUser = async (_req: express.Request, res: express.Response) => {
    const { _id } = _req.body;

    if (!_id) return res.status(400).send("No user ID given");

    try {
      const user = await User.findById({
        _id: new mongoose.Types.ObjectId(_id),
      }, { password: 0});

      if (!user) return res.status(400).send("Found no users");

      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export default UsersController;
