import { Request, Response, NextFunction } from "express";
import UserModel, { UserDocument } from "../Models/userModel.js";
import { GlobalData } from "../Utils/BaseData.js";

// get a user
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId = req?.params?.id;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      const { password, ...otherInfo } = user.toJSON() as UserDocument;
      return res.status(200).json(otherInfo);
    } else {
      return res.status(404).json({ message: "No Such User Found." });
    }
  } catch (error) {
    next({ message: "Please provide valid user user ID!.", status: 500 });
  }
};

// updateing user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req?.params?.id;
  const { currentUserId, currentUserAdminStatus, password } = req?.body;
  try {
    if (id === currentUserId || currentUserAdminStatus) {
      if (password) {
        req.body.password = await GlobalData?.genrateHashPass(password);
      }
      const userUpdate = await UserModel.findByIdAndUpdate(id, req?.body, {
        new: true,
      });
      return res.status(200).json(userUpdate);
    } else {
      const error: any = new Error(
        "Access Denied!.You can only update your own profile."
      );
      error.status = 403;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req?.params?.id;
  const { currentUserId, currentUserAdminStatus } = req?.body;
  try {
    if (id === currentUserId || currentUserAdminStatus) {
      const result = await UserModel.findByIdAndDelete(id);
      return res.status(result ? 200 : 404).json({
        message: result
          ? "User account is deleted successfully."
          : "No user is found.",
      });
    } else {
      const error: any = new Error(
        "Access Denied!.You can only delete your own profile."
      );
      error.status = 403;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// follow user
export const followUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req?.params?.id;
  const { currentUserId } = req?.body;
  if (id === currentUserId) {
    return res.status(403).json({ message: "Action forbidden." });
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);
      if (!followerUser?.friends?.includes(currentUserId)) {
        await followerUser?.updateOne({
          $push: { friends: currentUserId },
        });
        await followingUser?.updateOne({
          $push: { following: id },
        });
        return res.status(200).json({ message: "User followed." });
      } else {
        return res
          .status(403)
          .json({ message: "User is already following you." });
      }
    } catch (error) {
      next(error);
    }
  }
};

// unfollow user
export const unfollowUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req?.params?.id;
  const { currentUserId } = req?.body;
  if (id === currentUserId) {
    return res.status(403).json({ message: "Action forbidden." });
  } else {
    try {
      const followerUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);
      if (followerUser?.friends?.includes(currentUserId)) {
        await followerUser?.updateOne({
          $pull: { friends: currentUserId },
        });
        await followingUser?.updateOne({
          $pull: { following: id },
        });
        return res.status(200).json({ message: "User unfollowed." });
      } else {
        return res
          .status(403)
          .json({ message: "User is not followed by you." });
      }
    } catch (error) {
      next(error);
    }
  }
};
