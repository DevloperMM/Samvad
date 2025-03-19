import { Router } from "express";
import { authProtect } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/users", authProtect, getUsersForSidebar);
router.get("/:id", authProtect, getMessages);
router.post("/send/:id", authProtect, sendMessage);

export default router;
