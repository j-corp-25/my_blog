const User = require("./../models/User");
const Article = require("./../models/Article");

// control action to create a new user
exports.addUser = (req, res) => {
  new User(req.body).save((err, newUser) => {
    if (err) res.send(err);
    else if (!newUser) res.send(400);
    else res.send(newUser);
  });
};

exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) res.status(404).send("User not found");
      else res.send(user);
    })
    .catch((err) => res.status(500).send(err));
};
