import mongoose from "mongoose";
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
    },
    provider_id: {
      type: String,
    },
    token: {
      type: String,
    },
    provider_pic: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.follow = function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
  }
  return this.save();
};

UserSchema.methods.addFollower = function (followerId) {
  if (!this.followers.includes(followerId)) {
    this.followers.push(followerId);
  }
  return this.save();
};

export default mongoose.model("User", UserSchema);
