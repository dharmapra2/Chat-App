"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectMongodb() {
    await mongoose_1.default
        .connect(`${process.env.MONGODB_CRIDIENTIAL}`, {
        socketTimeoutMS: 1000,
        dbName: "chat-app",
    })
        .then(() => {
        console.log("MongoDb is connected succesfully");
    })
        .catch((err) => console.error("connection error", err));
}
exports.default = connectMongodb;
