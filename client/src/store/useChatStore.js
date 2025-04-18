import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  isMessaging: false,
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

  updateUsers: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newUser");
    socket.on("newUser", (user) => {
      const currUsers = get().users;
      const isExist = currUsers.some((u) => u._id === user._id);

      if (!isExist) {
        set({ users: [...currUsers, user] });
      }
    });
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
    set({ isMessaging: true });
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `/messages/send/${selectedUser._id}`,
        msgData
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessaging: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
