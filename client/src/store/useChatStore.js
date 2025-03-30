import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (msgData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `/messages/send/${selectedUser._id}`,
        msgData
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  // TODO: Optimise this one later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
