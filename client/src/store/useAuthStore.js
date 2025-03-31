import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check-user");
      set({ authUser: res.data });

      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Member registered");

      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success(`Welcome ${res.data.fullName}`);

      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      let res = await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success(res.data.msg);

      get().disconnectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/auth/update-pic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
