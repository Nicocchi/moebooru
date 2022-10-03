import { Request, Response, Router } from "express";
import { Artist } from "models/Artists";

class ArtistsController {
  public path = "/artists";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getArtist);
  }

  getArtist = (_req: Request, res: Response) => {
    try {
      Artist.find(
        _req.query.artists ? { $artists: { $regex: _req.query.artists, $options: "i" } } : {},
        (err: Error, doc: any) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Sorry, something went wrong");
          }
          return res.status(200).send(doc);
        }
      );
    } catch (error) {
      return res.status(500).send(error);
    }
    return;
  };
}

export default ArtistsController;
