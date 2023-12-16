const User = require("./../models/User");
const Article = require("./../models/Article");

// control action to create a new user
export function addUser(req, res){
  new User(req.body).save((err, newUser) => {
    if (err) res.send(err);
    else if (!newUser) res.send(400);
    else res.send(newUser);
  });
};
// control action to get user by userId
export function getUser(req, res){
  User.findById(req.params.id)
    .then((user) => {
      if (!user) res.status(404).send("User not found");
      else res.send(user);
    })
    .catch((err) => res.status(500).send(err));
};
// control action to follow a user
export function followUser(req, res){
    User.findById(req.body.id)
        .then((user) => {
            return user.followers(req.body.user_id)
            .then(() => {
                return res.json({msg: "followed"})
            })
        })
        .catch((err) => res.status(500).send(err))
}

// control action to get user profile, adds information for followers and following
export async function getUserProfile(req, res) {
    try {
        const _user = await User.findById(req.params.id)
            .populate('followers', 'name email')
            .populate('following', 'name email');
        if (!_user) {
            return res.status(404).send("User not found");
        }
        const _articles = await Article.find({'author': req.params.id});
        return res.json({ user: _user, articles: _articles });
    } catch (err) {
        return res.status(500).send(err);
    }
}

