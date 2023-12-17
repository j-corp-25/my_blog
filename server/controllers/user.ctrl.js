import User from "./../models/User.js";
import Article from "./../models/Article.js";

export async function addUser(req, res) {
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.send(savedUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
}


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
export async function followUser(req, res) {
    try {
        // id, the user to be followed
        // user_id, the user who is doing the following
        const { id, user_id } = req.body;

        // Find the user to be followed and update their followers array
        // using await here because it needs tp find the user in the database which will take time
        // any database actions will take a certain amount so using await  makes sure it "waits" for the correct response
        const userToBeFollowed = await User.findById(id);
        if (!userToBeFollowed) {
            return res.status(404).json({ msg: "User to be followed not found" });
        }
        await userToBeFollowed.addFollower(user_id);

        // Find the follower and update their following array
        const follower = await User.findById(user_id);
        if (!follower) {
            return res.status(404).json({ msg: "Follower not found" });
        }
        await follower.follow(id);

        res.json({ msg: "followed" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send(err.message);
    }
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
