import express from "express";
import { signupUser,loginUser, logoutUser, getCurrentUser, updateUserSubscription, uploadAvatar } from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.post("/signup", signupUser);

//LOGIN ROUTE

router.post("/login", loginUser);

//LOGOUT ROUTE

router.post("/logout", authenticateToken, logoutUser);

//GETTING CURRENT USER INFO 

router.get("/current", authenticateToken, getCurrentUser);

//UPDATE USER INFO

router.patch("/", authenticateToken, updateUserSubscription);

//UPLOAD AVATAR

router.patch("/avatars", authenticateToken, upload.single("avatar"), uploadAvatar);

export { router }