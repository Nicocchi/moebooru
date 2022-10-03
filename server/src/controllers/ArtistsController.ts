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
    if (!_req.query.artists) return res.status(200).send([]);
    Artist.find(
      { $artists: { $regex: _req.query.artists, $options: "i" } },
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

export default ArtistsController;
