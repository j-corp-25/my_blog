import mongoose from "mongoose";
const Schema = mongoose.Schema;

let ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    feature_img: {
      type: String,
    },
    claps: {
      type: Number,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
ArticleSchema.methods.clap = function () {
  this.claps++;
  return this.save();
};
ArticleSchema.methods.comment = function (comment) {
  this.comments.push(comment);
  return this.save();
};
ArticleSchema.methods.addAuthor = function (author_id) {
  this.author = author_id;
  return this.save();
};
ArticleSchema.methods.getUserArticle = function (_id) {
  ArticleSchema.find({ author: _id }).then((article) => {
    return article;
  });
};

export default mongoose.model("Article", ArticleSchema);
