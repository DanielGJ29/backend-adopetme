const express = require("express");

//Controllers
const {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  // deletePet,
} = require("./pet.controller");

//Middlewares
const {
  validateSession,
  protecAdmin,
} = require("../../middleware/auth.middlewares");

const {
  createPetValidators,
  validateResult,
} = require("../../middleware/validators.middleware");

const { petExist } = require("../../middleware/pet.middleware");

const { protectAccountOwner } = require("../../middleware/user.middleware");

//Utils
const { upload } = require("../../util/multer");

const router = express.Router();

router.get("/petimage", getAllPets);

router.get("/:id", petExist, getPetById);

router.use(validateSession);

router.post(
  "/savewithimage",
  protecAdmin,
  upload.array("image", 3),
  createPetValidators,
  validateResult,
  createPet
);

router.patch(
  "/:id",
  petExist,
  protectAccountOwner,
  upload.array("image", 3),
  updatePet
);

// router.delete("/user_delete/:id", userExist, protecAdmin, deleteUser);

module.exports = router;
