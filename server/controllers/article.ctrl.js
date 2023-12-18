import Article from "./../models/Article.js";
import cloudinary from "cloudinary";

export async function saveArticle(obj, req, res) {
  try {
    // Set the author ID before saving the article
    if (req.body.author_id) {
      obj.author = req.body.author_id;
    }

    const article = new Article(obj);
    const savedArticle = await article.save();

    res.send(savedArticle);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}



export function addArticle(req, res) {
  let { text, title, claps, description } = req.body;
  //using cloudinary for image upload
  // checks if there is a file when a request is sent
  if (req.files && req.files.image) {
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
        saveArticle(obj, req, res); // Pass req and res here
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    let obj = { text, title, claps, description, feature_img: "" };
    saveArticle(obj, req, res); // Pass req and res here
  }
}


export function getAll(req, res) {
  Article.find(req.params.id)
    .populate("author")
    .populate("comments.author")
    .then((err, article) => {
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
      if (!article) {
        return res.status(404).send("Article not found");
      }

      return article.comment({
        author: req.body.author_id,
        text: req.body.comment,
      })
      .then(() => {
        return res.json({ msg: "Done" });
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
}


export function getArticle(req, res) {
  Article.findById(req.params.id)
    .populate("author", "name email")
    .populate("comments.author", "_id name")
    .then((article) => {
      if (!article) {
        res.status(404).send("Article not found");
      } else {
        res.send(article);
      }
    })
    .catch((err) => {
      res.status(500).send(err.message || "An error occurred");
    });
}
