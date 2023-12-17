import { addArticle, getAll, clapArticle, commentArticle, getArticle } from "./../controllers/article.ctrl.js";
import multipart from "connect-multiparty";

const multipartWare = multipart();

export default function (router) {
  router.route("/articles").get(getAll);
  router.route("/article").post(multipartWare, addArticle);
  router.route("/article/clap").post(clapArticle);
  router.route("/article/comment").post(commentArticle);
  router.route("/article/:id").get(getArticle);
}
