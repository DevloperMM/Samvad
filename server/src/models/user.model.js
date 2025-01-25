import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    isMale: {
      type: Boolean,
      default: true,
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.profilePic) {
    this.profilePic = this.isMale
      ? "https://res.cloudinary.com/media-node/image/upload/v1737813046/c7vlcexcokxmz510lyba.jpg"
      : "https://res.cloudinary.com/media-node/image/upload/v1737813103/lt8nxw1pgp4f5mvxpu5x.jpg";
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
