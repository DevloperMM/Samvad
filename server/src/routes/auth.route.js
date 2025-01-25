import { Router } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updatePic,
} from "../controllers/auth.controller.js";
import { authProtect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-pic", authProtect, updatePic);
router.get("/check-user", authProtect, checkAuth);

export default router;
