const { Router } = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  checkToken,
  getCurrentUser,
  updateSubscription,
} = require("./user-controllers.js");
const {
  validateRegistration,
  validateLogin,
  validateId,
  validateUpdateSubscription,
} = require("./user-validation.js");

const userRouter = Router();

userRouter.patch(
  "/",
  checkToken,
  validateUpdateSubscription,
  updateSubscription
);

userRouter.post("/auth/register", validateRegistration, registerUser);

userRouter.post("/auth/login", validateLogin, loginUser);

userRouter.patch("/auth/logout", checkToken, logoutUser);

userRouter.get("/current", checkToken, getCurrentUser);

module.exports = userRouter;
