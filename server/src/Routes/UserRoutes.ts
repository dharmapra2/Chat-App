import express from "express";
import {
  deleteUser,
  followUsers,
  getUser,
  unfollowUsers,
  updateUser,
} from "../Controllers/UserController.js";

const router = express.Router();

// here we'll get user by thier id
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUsers);
router.put("/:id/unfollow", unfollowUsers);

export default router;
