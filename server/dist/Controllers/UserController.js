"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUsers = exports.followUsers = exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const userModel_js_1 = __importDefault(require("../Models/userModel.js"));
const BaseData_js_1 = require("../Utils/BaseData.js");
// get a user
const getUser = async (req, res, next) => {
    const userId = req?.params?.id;
    try {
        const user = await userModel_js_1.default.findById(userId);
        if (user) {
            const { password, ...otherInfo } = user.toJSON();
            return res.status(200).json(otherInfo);
        }
        else {
            return res.status(404).json({ message: "No Such User Found." });
        }
    }
    catch (error) {
        next({ message: "Please provide valid user user ID!.", status: 500 });
    }
};
exports.getUser = getUser;
// updateing user
const updateUser = async (req, res, next) => {
    const id = req?.params?.id;
    const { currentUserId, currentUserAdminStatus, password } = req?.body;
    try {
        if (id === currentUserId || currentUserAdminStatus) {
            if (password) {
                req.body.password = await BaseData_js_1.GlobalData?.genrateHashPass(password);
            }
            const userUpdate = await userModel_js_1.default.findByIdAndUpdate(id, req?.body, {
                new: true,
            });
            return res.status(200).json(userUpdate);
        }
        else {
            const error = new Error("Access Denied!.You can only update your own profile.");
            error.status = 403;
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
// delete user
const deleteUser = async (req, res, next) => {
    const id = req?.params?.id;
    const { currentUserId, currentUserAdminStatus } = req?.body;
    try {
        if (id === currentUserId || currentUserAdminStatus) {
            const result = await userModel_js_1.default.findByIdAndDelete(id);
            return res.status(result ? 200 : 404).json({
                message: result
                    ? "User account is deleted successfully."
                    : "No user is found.",
            });
        }
        else {
            const error = new Error("Access Denied!.You can only delete your own profile.");
            error.status = 403;
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
// follow user
const followUsers = async (req, res, next) => {
    const id = req?.params?.id;
    const { currentUserId } = req?.body;
    if (id === currentUserId) {
        return res.status(403).json({ message: "Action forbidden." });
    }
    else {
        try {
            const followerUser = await userModel_js_1.default.findById(id);
            const followingUser = await userModel_js_1.default.findById(currentUserId);
            if (!followerUser?.friends?.includes(currentUserId)) {
                await followerUser?.updateOne({
                    $push: { friends: currentUserId },
                });
                await followingUser?.updateOne({
                    $push: { following: id },
                });
                return res.status(200).json({ message: "User followed." });
            }
            else {
                return res
                    .status(403)
                    .json({ message: "User is already following you." });
            }
        }
        catch (error) {
            next(error);
        }
    }
};
exports.followUsers = followUsers;
// unfollow user
const unfollowUsers = async (req, res, next) => {
    const id = req?.params?.id;
    const { currentUserId } = req?.body;
    if (id === currentUserId) {
        return res.status(403).json({ message: "Action forbidden." });
    }
    else {
        try {
            const followerUser = await userModel_js_1.default.findById(id);
            const followingUser = await userModel_js_1.default.findById(currentUserId);
            if (followerUser?.friends?.includes(currentUserId)) {
                await followerUser?.updateOne({
                    $pull: { friends: currentUserId },
                });
                await followingUser?.updateOne({
                    $pull: { following: id },
                });
                return res.status(200).json({ message: "User unfollowed." });
            }
            else {
                return res
                    .status(403)
                    .json({ message: "User is not followed by you." });
            }
        }
        catch (error) {
            next(error);
        }
    }
};
exports.unfollowUsers = unfollowUsers;
