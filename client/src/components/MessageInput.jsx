import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, Send, X, Loader2Icon } from "lucide-react";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isMessaging } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image field");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      sendMessage({ text: text.trim(), image: imagePreview });

      // Clear Form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.log("Failed to send message: ", err);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Preview Image (if there) */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle cursor-pointer ${
              imagePreview ? "text-emerald-500" : "text-zinc-600"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          {!isMessaging ? (
            <Send size={22} />
          ) : (
            <Loader2Icon className="animate-spin" size={22} />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
