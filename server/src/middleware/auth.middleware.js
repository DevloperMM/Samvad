import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../lib/utils.js";
import User from "../models/user.model.js";

export const authProtect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, "Unauthorized: Invalid Token");

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new ApiError(404, "Unauthorized: Token Forged");

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

// TODO: Add Forgot password and email verification
