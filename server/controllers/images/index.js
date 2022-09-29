const multer = require("multer");
const imageSize = require("image-size");
const imageModel = require("../../models/upload");
const tagModel = require("../../models/tags");
const artistModel = require("../../models/artists");
const imageDir = process.env.IMAGE_DIR;
/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
const upload = multer({ storage: storage }).single("image");

exports.imageUpload = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send("Sorry, something went wrong");
    }

    console.log("FILE", req.file);
    console.log("REQ BODY", req.body);

    if (!req.file) {
      return res.status(400).send({
        content: "Sorry, no file supplied",
        error: err,
      });
    }

    let tags = [];
    let artists = [];

    tags = req.body.tags.split(" ").join("_").toLowerCase().split(",");
    artists = req.body.artists.split(" ").join("_").toLowerCase().split(",");

    console.log("Tags: ", tags);
    console.log("Artists: ", artists);

    const filename = req.file.filename;
    const dims = imageSize(`${imageDir}/${filename}`);
    const imageDetails = new imageModel({
      name: filename,
      artists: artists,
      tags: tags,
      uploader: "Anonymous",
      width: dims.width,
      height: dims.height,
      type: dims.type,
      source: req.body.source,
      nsfw: req.body.nsfw,
      hidden: req.body.hidden,
      anonymous: req.body.anonymous,
    });

    imageDetails.save((err, doc) => {
      if (err) {
        return res.status(400).send({
          content: "Sorry, something went wrong",
          error: err,
        });
      }

      tags.forEach((element) => {
        tagModel.updateOne(
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
        artistModel.updateOne(
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

      return res.status(200).send("upload successful");
    });
  });
};

exports.imageGetAll = async (req, res) => {
  let tags = [];
  let artists = [];

  if (req.query.artists) artists = req.query.artists.split(",");
  if (req.query.tags) tags = req.query.tags.split(",");
  let posts = null;

  try {
    if (req.query.tags && req.query.artists) {
      posts = await imageModel.find({ tags: { $in: tags }, artists: {$in: artists}});
    } else if (req.query.artists) {
      posts = await imageModel.find({ artists: { $in: artists }});
    } else if (req.query.tags) {
      posts = await imageModel.find({ tags: { $in: tags }});
    } else {
      posts = await imageModel.find({});
    }

    return res.status(200).send(posts);
    
  } catch (error) {
    return res.status(400).send({
      content: "Sorry, something went wrong",
      error,
    })
  }
};

exports.imageGet = async (req, res) => {
  if (req.query.post_id) {
    try {
      const post = await imageModel.find({ _id: req.query.post_id });

      let tags = [];
      let artists = [];

      const postTags = post[0].tags;
      const postArtists = post[0].artists;

      if (postTags) {
        try {
          await Promise.all(
            postTags.map(async (tag) => {
              const count = await imageModel
                .countDocuments({ tags: { $in: tag } })
                .exec();

              const newTag = {
                name: tag,
                count,
              };
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
            postArtists.map(async (artist) => {
              const count = await imageModel
                .countDocuments({ artists: { $in: artist } })
                .exec();

              const newArtist = {
                name: artist,
                count,
              };
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
};

exports.tagGet = (req, res) => {
  tagModel.find(
    { $tags: { $regex: req.query.tag, $options: "i" } },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Sorry, something went wrong");
      }

      console.log(doc);
      return res.status(200).send(doc);
    }
  );
};

exports.artistGet = (req, res) => {
  artistModel.find(
    { $artists: { $regex: req.query.artist, $options: "i" } },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Sorry, something went wrong");
      }

      console.log(doc);
      return res.status(200).send(doc);
    }
  );
};

exports.updateImage = async (req, res) => {
  try {
    const { _id, tags, ...body } = req.body;
    const post = await imageModel.find({ _id });

    if (!post) return res.status(404).send({ content: "No post found" });

    let ntags = [];
    let artists = [];

    const postTags = post[0].tags;
    const postArtists = post[0].artists;
    let bodyTags = [];



    if (req.body.tags) {
      bodyTags = req.body.tags
        .split(" ")
        .join("_")
        .toLowerCase()
        .split(",");

      bodyTags.forEach((element) => {
        tagModel.updateOne(
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

    if (req.body.artists) {
      const bodyArtists = req.body.artists
        .split(" ")
        .join("_")
        .toLowerCase()
        .split(",");
      bodyArtists.forEach((element) => {
        artistModel.updateOne(
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
    ntags = [...new Set(newTags)]


    const update = {
      ...body,
      $addToSet: {tags: ntags },
      artists
    }

    const doc = await imageModel.updateOne({_id}, {
      ...body,
      artists,
      $addToSet: { tags: ntags},
    });

    return res.status(200).send(doc);
  } catch (err) {
    return res
      .status(400)
      .send({ content: "Sorry, something went wrong", error: err });
  }
};
