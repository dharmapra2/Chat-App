"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../Models/userModel"));
const BaseData_1 = require("../Utils/BaseData");
// Registering a new user
const registerUser = async (req, res, next) => {
    const { password, first_name, last_name, userName } = req.body;
    const hashPassword = await BaseData_1.GlobalData?.genrateHashPass(password);
    const registerNewUser = new userModel_1.default({
        password: hashPassword,
        first_name,
        last_name,
        userName,
    });
    try {
        const oldUser = await userModel_1.default.findOne({ userName });
        if (oldUser) {
            return res
                .status(200)
                .json({ message: "User Name is already registered.." });
        }
        const newUser = await registerNewUser.save();
        // const token = jwt.sign(
        //   {
        //     userName: newUser?.userName,
        //     id: newUser._id,
        //   },
        //   process.env.JWT_TOKEN,
        //   { expiresIn: "1h" }
        // );
        return res.status(200).json({ user: newUser });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
// Login an existing user
const loginUser = async (req, res, next) => {
    const { userName, password } = req?.body;
    try {
        const searchUser = await userModel_1.default.findOne({ userName });
        if (searchUser) {
            const checkPassword = await BaseData_1.GlobalData?.comparePass(password, searchUser?.password);
            if (!checkPassword) {
                return res
                    .status(400)
                    .json({ message: "Login credential does not match." });
            }
            // const token = jwt.sign(
            //   {
            //     userName: searchUser?.userName,
            //     id: searchUser._id,
            //   },
            //   process.env.JWT_TOKEN,
            //   { expiresIn: "1h" }
            // );
            return res.status(200).json({
                message: "You Successfully logged in.",
                user: searchUser,
            });
        }
        else {
            return res.status(404).json({ message: "User does not exist." });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
