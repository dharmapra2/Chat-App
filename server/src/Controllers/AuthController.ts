import { Request, Response, NextFunction } from "express";
import UserModel from "../Models/userModel";
import { GlobalData } from "../Utils/BaseData";

// Registering a new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { password, first_name, last_name, userName } = req.body;
  const hashPassword = await GlobalData?.genrateHashPass(password);
  const registerNewUser = new UserModel({
    password: hashPassword,
    first_name,
    last_name,
    userName,
  });
  try {
    const oldUser = await UserModel.findOne({ userName });
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
  } catch (error) {
    next(error);
  }
};

// Login an existing user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { userName, password } = req?.body;
  try {
    const searchUser = await UserModel.findOne({ userName });
    if (searchUser) {
      const checkPassword = await GlobalData?.comparePass(
        password,
        searchUser?.password
      );
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
    } else {
      return res.status(404).json({ message: "User does not exist." });
    }
  } catch (error) {
    next(error);
  }
};
