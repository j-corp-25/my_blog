const Article = require('./../models/Article')
const User = require('./../models/User')
const fs = require('fs')
const cloudinary = require('cloudinary')


exports.addArticle = (req, res) => {
    let {text, title, claps, description} = req.body

    if (req.files.image) {
        cloudinary.UploadStream.upload(req.files.image.path,(result) => {
            let obj = {text, title, claps, description, feature_img: result.url != null ? result.url : ""}
            saveArticle(obj)

        })
    }
}
