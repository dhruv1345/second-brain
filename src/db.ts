import mongoose,{ model, Schema } from "mongoose";

mongoose.connect("mongodb+srv://dhruv:devforgoogle@cluster0.ak8nu.mongodb.net/")

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);