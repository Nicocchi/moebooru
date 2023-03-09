import "dotenv/config";
import App from "./app";
import UsersController from "controllers/UsersController";
import LoginController from "controllers/LoginController";
import RegisterController from "controllers/RegisterController";
import PostsController from "controllers/PostsController";
import TagsController from "controllers/TagsController";
import ArtistsController from "controllers/ArtistsController";
import RefreshTokenController from "controllers/RefreshTokenController";
import LogoutController from "controllers/LogoutController";
import RolesController from "./controllers/RolesController";
import RootController from "./controllers/RootController";

const _PORT = Number(process.env.PORT) || 5000;

const app = new App(
  [
    new RootController(),
    new LoginController(),
    new LogoutController(),
    new RegisterController(),
    new UsersController(),
    new RefreshTokenController(),
    new PostsController(),
    new TagsController(),
    new ArtistsController(),
    new RolesController(),
  ],
  _PORT
);

app.listen();
