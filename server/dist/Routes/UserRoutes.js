"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_js_1 = require("../Controllers/UserController.js");
const router = express_1.default.Router();
// here we'll get user by thier id
router.get("/:id", UserController_js_1.getUser);
router.put("/:id", UserController_js_1.updateUser);
router.delete("/:id", UserController_js_1.deleteUser);
router.put("/:id/follow", UserController_js_1.followUsers);
router.put("/:id/unfollow", UserController_js_1.unfollowUsers);
exports.default = router;
