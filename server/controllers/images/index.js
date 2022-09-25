const multer = require("multer");
const imageSize = require("image-size");
const imageModel = require("../../models/upload");
const tagModel = require("../../models/tags");
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
    console.log("REQ", req);

    const filename = req.file.filename;
    const dims = imageSize(`${imageDir}/${filename}`);
    const imageDetails = new imageModel({
      name: filename,
      author: req.body.author,
      tags: req.body.tags.split(","),
      uploader: "Anonymous",
      width: dims.width,
      height: dims.height,
      type: dims.type,
      source: req.body.source,
    });

    imageDetails.save((err, doc) => {
      if (err) {
        return res.status(400).send({
          content: "Sorry, something went wrong",
          error: err,
        });
      }

      const tags = req.body.tags.split(",");
      tags.forEach((element) => {
        // const tag = new tagModel({
        //   name: element,
        // });

        tagModel.update(
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

exports.imageGetAll = (req, res) => {
  console.log("QUERY ", req.query)
  if (req.query.tags) {
    const tags = req.query.tags.split(",");
    console.log("TAGS", req.query);

    imageModel.find({tags: {"$in": tags}}, (err, images) => {
      if (err) {
        return res.status(400).send({
          content: "Sorry, something went wrong",
          error: err,
        });
      }

      return res.status(200).send(images)
    })
  } else {
    imageModel.find({}, (err, images) => {
      if (err) {
        return res.status(400).send({
          content: "Sorry, something went wrong",
          error: err,
        });
      }
  
      console.log(images);
  
      return res.status(200).send(images);
    });
  }

  
};

exports.imageGet = (req, res) => {
  if (req.query.post_id) {
    imageModel.find({ _id: req.query.post_id }, (err, images) => {
      if (err) {
        return res.status(400).send({
          content: "Sorry, something went wrong",
          error: err,
        });
      }

      console.log(images);

      return res.status(200).send(images);
    });
  }
};

exports.tagGet = (req, res) => {
  tagModel.find({$text: {$search: req.query.tag_name}}, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Sorry, something went wrong");
    }

    console.log(doc);
    return res.status(200).send(doc);
  })
}