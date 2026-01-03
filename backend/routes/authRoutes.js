import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  deactivateAccount,
  activateAccount,
} from "../controllers/authController.js";
// import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// router.get("/profile", authenticate, getProfile);
// router.put("/profile", authenticate, updateProfile);
// router.post("/deactivate", authenticate, deactivateAccount);
// router.post("/activate", authenticate, activateAccount);

// // Admin only routes
// router.get("/all", authenticate, isAdmin, getAllUsers);
// router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;
