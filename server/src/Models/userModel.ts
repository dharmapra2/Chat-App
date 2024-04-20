import mongoose, { Document, Schema } from "mongoose";

// Define a schema for a user
const userSchema = new Schema<UserDocument>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    profilePicture: String,
    about: String,
    relationshipStatus: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Define a model for the user schema
const UserModel = mongoose.model<UserDocument>("User", userSchema);

// Export the model and document interfaces for use in other files
export default UserModel;

// Define the User interface
export interface User {
  userName: string;
  password: string;
  first_name: string;
  last_name: string;
  profilePicture?: string;
  about?: string;
  relationshipStatus?: string;
  friends: string[];
}

// Define the UserDocument interface, extending both User and mongoose.Document
export interface UserDocument extends User, Document {}
