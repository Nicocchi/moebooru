import "dotenv/config";
import App from "./app";
import UsersController from "controllers/UsersController";
import LoginController from "controllers/LoginController";
import RegisterController from "controllers/RegisterController";
import PostsController from "controllers/PostsController";
import TagsController from "controllers/TagsController";
import ArtistsController from "controllers/ArtistsController";

const _PORT = Number(process.env.PORT!);

const app = new App(
  [
    new LoginController(),
    new RegisterController(),
    new UsersController(),
    new PostsController(),
    new TagsController(),
    new ArtistsController(),
  ],
  _PORT
);

app.listen();