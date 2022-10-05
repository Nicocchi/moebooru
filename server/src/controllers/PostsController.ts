import { Request, Response, Router } from "express";
import { ValidateToken } from "utils";
import imageSize from "image-size";
import { Post } from "models/Posts";
import { Tag } from "models/Tags";
import { Artist } from "models/Artists";
import { fileUpload } from "./MulterController";
import { CheckAuthorization } from "middleware/verifyJWT";

const imageDir = process.env.IMAGE_DIR || "public/";

class PostsController {
  public path = "/posts";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getPost);
    this.router.get("/posts", this.getAllPosts);
    this.router.post(this.path, CheckAuthorization, this.addPost);
    this.router.put(this.path, CheckAuthorization, this.updatePost);
  }

  addPost = (_req: Request, res: Response) => {
    fileUpload(_req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).send("Sorry, something went wrong");
      }

      if (!_req.file) {
        return res.status(400).send({
          content: "Sorry, no file supplied",
          error: err,
        });
      }

      // Add post to the database
      let tags: string[] = [];
      let artists: string[] = [];

      tags = _req.body.tags.split(" ").join("_").toLowerCase().split(",");
      artists = _req.body.artists.split(" ").join("_").toLowerCase().split(",");

      const filename = _req.file.filename;
      const dims = imageSize(`${imageDir}/${filename}`);

      const token = _req.headers.authorization || "";
      const user = ValidateToken(token);

      const post = new Post({
        name: filename,
        artists: artists,
        tags: tags,
        uploader: user.id,
        width: dims.width,
        height: dims.height,
        type: dims.type,
        source: _req.body.source,
        nsfw: _req.body.nsfw,
        hidden: _req.body.hidden,
        anonymous: _req.body.anonymous,
      });

      // Add tags & artists to the database
      tags.forEach((element) => {
        Tag.updateOne(
          { name: element },
          { name: element },
          { upsert: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      artists.forEach((element) => {
        Artist.updateOne(
          { name: element },
          { name: element },
          { upsert: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      // Save post to the database
      post.save((err, doc) => {
        if (err) {
          return res.status(400).send({
            content: "Sorry, something went wrong",
            error: err,
          });
        }

        return res.status(200).send("upload successful");
      });

      return;
    });
  };

  getPost = async (_req: Request, res: Response) => {
    if (_req.query.post_id) {
      try {
        const post = await Post.find({ _id: _req.query.post_id });

        let tags: object[] = [];
        let artists: object[] = [];

        const postTags = post[0].tags as unknown as any[];
        const postArtists = post[0].artists as unknown as any[];

        if (postTags) {
          try {
            await Promise.all(
              postTags.map(async (tag: string) => {
                const count = await Post.countDocuments({
                  tags: { $in: tag },
                }).exec();
                const newTag = {
                  name: tag,
                  count,
                }
                tags.push(newTag);
              })
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (postArtists) {
          try {
            await Promise.all(
              postArtists.map(async (artist: string) => {
                const count = await Post.countDocuments({
                  artists: { $in: artist },
                }).exec();
                const newArtist = {
                  name: artist,
                  count,
                }
                artists.push(newArtist);
              })
            );
          } catch (err) {
            console.log(err);
          }
        }

        return res.status(200).send({
          post,
          tags,
          artists,
        });
      } catch (err) {
        return res
          .status(400)
          .send({ content: "Sorry, something went wrong", error: err });
      }
    }

    let tags: string[] = [];
    let artists: string[] = [];

    if (_req.query.artists) artists = (_req.query.artists as string).split(",");
    if (_req.query.tags) tags = (_req.query.tags as string).split(",");
    let posts = null;

    try {
      if (_req.query.tags && _req.query.artists) {
        posts = await Post.find({
          tags: { $in: tags },
          artists: { $in: artists },
        });
      } else if (_req.query.artists) {
        posts = await Post.find({ artists: { $in: artists } });
      } else if (_req.query.tags) {
        posts = await Post.find({ tags: { $in: tags } });
      } else {
        posts = await Post.find({});
      }

      return res.status(200).send(posts);
    } catch (error) {
      return res.status(400).send({
        content: "Sorry, something went wrong",
        error,
      });
    }

    return;
  };

  getAllPosts = async (_req: Request, res: Response) => {
    let tags: string[] = [];
    let artists: string[] = [];

    let limit = 0;
    let last_id = null;

    if (_req.query.artists) artists = (_req.query.artists as string).split(",");
    if (_req.query.tags) tags = (_req.query.tags as string).split(",");
    if (_req.query.limit) limit = Number(_req.query.limit);
    if (_req.query.last_id) last_id = Number(_req.query.last_id);
    let posts = null;

    try {
      if (_req.query.tags && _req.query.artists) {
        posts = await Post.find({
          tags: { $in: tags },
          artists: { $in: artists },
          _id: { $gt: last_id },
        }).limit(limit);
      } else if (_req.query.artists) {
        posts = await Post.find({
          artists: { $in: artists },
          _id: { $gt: last_id },
        }).limit(limit);
      } else if (_req.query.tags) {
        posts = await Post.find({
          tags: { $in: tags },
          _id: { $gt: last_id },
        }).limit(limit);
      } else {
        if (last_id !== null) {
          posts = await Post.find({});
        } else {
          posts = await Post.find({ _id: { $gt: last_id } }).limit(limit);
        }
      }

      return res.status(200).send(posts);
    } catch (error) {
      return res.status(400).send({
        content: "Sorry, something went wrong",
        error,
      });
    }

    return;
  };

  updatePost = async (_req: Request, res: Response) => {
    try {
      const { _id, tags, ...body } = _req.body;
      const post = await Post.find({ _id });

      if (!post) return res.status(404).send({ content: "No post found" });

      let ntags = [];
      let artists = [];

      const postTags = post[0].tags as unknown as any[];
      const postArtists = post[0].artists as unknown as any[];
      let bodyTags = [];

      if (_req.body.tags) {
        bodyTags = _req.body.tags.split(" ").join("_").toLowerCase().split(",");

        bodyTags.forEach((element: string) => {
          Tag.updateOne(
            { name: element },
            { name: element },
            { upsert: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
      } else {
        ntags = postTags.map((tag) => tag);
      }

      if (_req.body.artists) {
        const bodyArtists = _req.body.artists
          .split(" ")
          .join("_")
          .toLowerCase()
          .split(",");
        bodyArtists.forEach((element: string) => {
          Artist.updateOne(
            { name: element },
            { name: element },
            { upsert: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
      } else {
        artists = postArtists.map((artist) => artist);
      }

      const newTags = postTags.concat(bodyTags);
      ntags = [...new Set(newTags)];

      const update = {
        ...body,
        $addToSet: { tags: ntags },
        artists,
      };

      const doc = await Post.updateOne(
        { _id },
        {
          ...body,
          artists,
          $addToSet: { tags: ntags },
        }
      );

      return res.status(200).send(doc);
    } catch (err) {
      return res
        .status(400)
        .send({ content: "Sorry, something went wrong", error: err });
    }
  };
}

export default PostsController;
