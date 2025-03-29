import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check-user");
      set({ authUser: res.data });
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // TODO: Implement gender using isMale and profile photo during signup
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Member registered");
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
}));
