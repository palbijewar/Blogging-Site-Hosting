import express from 'express';
import { createUser, loginUser, google, updateUserProfile, deleteUser, signoutUser, getUsers, getUserById } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/google", google);
router.post("/signout", signoutUser);

router.get("/", verifyToken, getUsers);
router.get("/:userId", getUserById);

router.put("/:id", verifyToken, updateUserProfile);

router.delete("/:id", verifyToken, deleteUser);

export default router;
