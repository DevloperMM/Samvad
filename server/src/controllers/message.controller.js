import { ApiError, asyncHandler } from "../lib/utils.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloud
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: `${process.env.CLOUDINARY_PROJECT}/Messages`,
        resource_type: "auto",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // TODO: Realtime functionality goes here => socket.io

    return res.status(200).json(newMessage);
  } catch (err) {
    throw new ApiError(err?.code, err?.message);
  }
});
