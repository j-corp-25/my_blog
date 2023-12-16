import Article from "./../models/Article";
import User from "./../models/User";
import fs from "fs";
import cloudinary from "cloudinary";


export function saveArticle(obj, req, res) {
  new Article(obj).save((err, article) => {
    if (err) {
      res.send(err);
    } else if (!article) {
      res.status(400).send("Failed to create article");
    } else {
      article
        .addAuthor(req.body.author_id)
        .then((_article) => {
          res.send(_article);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  });
}

export function addArticle(req, res) {
  let { text, title, claps, description } = req.body;

  if (req.files.image) {
    cloudinary.v2.uploader
      .upload(req.files.image.path, {
        resource_type: "image",
        transformation: [
          { height: 200, width: 200, crop: "thumb" },
          { radius: "max" },
        ],
      })
      .then((result) => {
        let obj = {
          text,
          title,
          claps,
          description,
          feature_img: result.url ? result.url : "",
        };
        saveArticle(obj);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    saveArticle({ text, title, claps, description, feature_img: "" });
  }
}

export function getAll(req, res) {
  Article.find(req.params.id)
    .populate("author")
    .populate("comments.author")
    .exec((err, article) => {
      if (err) res.send(err);
      else if (!article) res.send(404);
      else res.send(article);
    });
}

export function clapArticle(req, res) {
  Article.findById(req.body.article_id)
    .then((article) => {
      return article.clap().then(() => {
        res.status(200).json({ msg: "Done" });
      });
    })
    .catch((err) => {
      res.status(500).send(err.message || "Error processing your request");
    });
}

export function commentArticle(req, res) {
  Article.findById(req.body.article_id)
    .then((article) => {
      return article
        .comment({
          author: req.body.author_id,
          text: req.body.comment,
        })
        .then(() => {
          return res.json({ msg: "Done" });
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export function getArticle(req, res) {
  Article.findById(req.params.id)
    .populate("author")
    .populate("comments.author")
    .exec((err, article) => {
      if (err) res.send(err);
      else if (!article) res.send(404);
      else res.send(article);
    });
}
