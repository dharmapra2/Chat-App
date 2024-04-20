"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    desc: String,
    likes: [],
    image: String,
}, { timestamps: true });
const PostModel = mongoose_1.default.model("Posts", postSchema);
exports.default = PostModel;
