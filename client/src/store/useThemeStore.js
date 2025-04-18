import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chatTheme") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("chatTheme", theme);
    set({ theme });
  },
}));
