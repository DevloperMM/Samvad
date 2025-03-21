import { asyncHandler, ApiError, generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, isMale } = req.body;
  try {
    if (!(fullName && email && password)) {
      throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const user = await User.findOne({ email });

    if (user) throw new ApiError(400, "Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashPass, isMale });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json(newUser);
    } else {
      throw new ApiError(400, "Invalid user data");
    }
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "No such user exist");
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw new ApiError(400, "Invalid credentials");
    }

    generateToken(user._id, res);

    return res.status(200).json(user);
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  return res.status(200).json({ msg: "User logged out" });
});

export const updatePic = asyncHandler(async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) throw new ApiError(400, "Profile Pic is required");

    const uploadRes = await cloudinary.uploader.upload(profilePic, {
      folder: process.env.CLOUDINARY_PROJECT,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

export const checkAuth = asyncHandler(async (req, res) => {
  if (req?.user) return res.status(200).json(req.user);
  throw new ApiError(400, "User is not logged in");
});
