const mongoose = require("mongoose");

mongoose.connect(
  `${process.env.DB_MONGO_URL}/${process.env.DB_MONGO_DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once(
  "open",
  (callback = () => {
    console.log("db connected");
  })
);

const uploadSchema = new mongoose.Schema({
  artists: Array,
  name: String,
  tags: Array,
  uploader: String,
  width: Number,
  height: Number,
  type: String,
  source: String,
  nsfw: Boolean,
  hidden: Boolean,
  anonymous: Boolean,
});

const uploadModel = mongoose.model("images", uploadSchema);

module.exports = uploadModel;
