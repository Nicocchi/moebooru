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

const schema = new mongoose.Schema({
  name: { type: String, unique: true },
});

const artistModel = mongoose.model("artists", schema);

module.exports = artistModel;
