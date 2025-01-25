import mongoose, { mongo } from "mongoose";

const msgSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

msgSchema.pre("save", function (next) {
  this.image = !this.image ? "" : this.image;
  next();
});

const Message = mongoose.model("Message", msgSchema);

export default Message;
