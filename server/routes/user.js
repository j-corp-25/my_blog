import { getUser, addUser, followUser, getUserProfile } from './../controllers/user.ctrl.js';

export default function (router) {
  router.route("/user/:id").get(getUser);
  router.route("/user/profile/:id").get(getUserProfile);
  router.route("/user").post(addUser);
  router.route("/user/follow").post(followUser);
}
