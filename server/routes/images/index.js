const controller = require("../../controllers/images");

module.exports = (app) => {
  app.get("/images", controller.imageGetAll)
  app.get("/post", controller.imageGet)
  app.get("/tag", controller.tagGet)
  app.get("/artist", controller.artistGet)
  app.post("/", controller.imageUpload)
};
