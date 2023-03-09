import * as express from "express";
import { Role } from "../models/Roles";
import { CheckAuthorization } from "middleware/verifyJWT";

class RolesController {
  public path = "/roles";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllRoles);
  }

  getAllRoles = async (_req: express.Request, res: express.Response) => {
    const roles = await Role.find({});

    try {
      const roles = await Role.find({});

      if (!roles) return res.status(500).send("Failed to retrieve roles");

      return res.status(200).send(roles);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export default RolesController;
