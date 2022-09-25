require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const _PORT = process.env.PORT;
const imageDir = process.env.IMAGE_DIR;

const app = express();

app.use(express.static(imageDir));
app.use(morgan("dev"));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  next();
});

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/", (req, res) => {
  res.sendFile(`${imageDir}/image_1664103628713_haachama_5_8k.png`)
})

require("./routes/images")(app);

app.listen(_PORT, () => {
  console.log(`Server is listening on port: ${_PORT}`);
});
