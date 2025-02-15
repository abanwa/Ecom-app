const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware
} = require("../../controllers/auth/auth-controller");

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", logoutUser);
AuthRouter.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user
  });
});

module.exports = AuthRouter;
