const express = require("express");

//Controllers
const {
  createUser,
  getAllUsers,
  getUserById,
  login,
  refreshToken,
  checkToken,
  updateUser,
  deleteUser,
} = require("./auth.controller");

//Middlewares
const {
  validateSession,
  protecAdmin,
} = require("../../middleware/auth.middlewares");
const {
  userExist,
  protectAccountOwner,
} = require("../../middleware/user.middleware");
const {
  createUserValidators,
  validateResult,
} = require("../../middleware/validators.middleware");

//Utils
const { upload } = require("../../util/multer");

const router = express.Router();

router.post("/login", login);

//router.post("/refreshToken", refreshToken);

router.post(
  "/create",
  //protecAdmin,
  upload.single("avatarUrl"),
  createUserValidators,
  validateResult,
  createUser
);

router.get("/users_details/:id", userExist, getUserById);

router.use(validateSession);

router.get("/users", protecAdmin, getAllUsers);

//router.get("/check-token", protecAdmin, checkToken);

//router.use("/:id", userExist);

router.patch(
  "/user_update/:id",
  userExist,
  protectAccountOwner,
  upload.single("avatarUrl"),
  updateUser
);

router.delete("/user_delete/:id", userExist, protecAdmin, deleteUser);

module.exports = router;
