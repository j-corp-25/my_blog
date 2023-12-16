const Article = require("./../models/Article");
const User = require("./../models/User");
const fs = require("fs");
const cloudinary = require("cloudinary");

function saveArticle(obj, req, res) {
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

exports.addArticle = (req, res) => {
  let { text, title, claps, description } = req.body;

  if (req.files.image) {
    cloudinary.uploader
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
};
