import * as express from "express";
import { CheckAuthorization } from "middleware/verifyJWT";
import { Role } from "models/Roles";

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
