const { Router } = require("express");
const { upload, minifyImage } = require("./user-avatars.js");

const {
  registerUser,
  loginUser,
  logoutUser,
  checkToken,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
} = require("./user-controllers.js");
const {
  validateRegistration,
  validateLogin,
  validateId,
  validateUpdateSubscription,
} = require("./user-validation.js");

const userRouter = Router();

userRouter.get("/current", checkToken, getCurrentUser);

userRouter.post("/auth/register", validateRegistration, registerUser);

userRouter.post("/auth/login", validateLogin, loginUser);

userRouter.patch(
  "/",
  checkToken,
  validateUpdateSubscription,
  updateSubscription
);

userRouter.patch("/auth/logout", checkToken, logoutUser);

userRouter.patch(
  "/avatar",
  upload.single("avatar") || upload.none(),
  checkToken,
  updateAvatar
);

module.exports = userRouter;
