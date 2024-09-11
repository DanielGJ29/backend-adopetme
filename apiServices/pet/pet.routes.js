const express = require("express");

//Controllers
const {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  searchPet,
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
const { petImageExist } = require("../../middleware/image.middlewares");

//Utils
const { upload } = require("../../util/multer");

const router = express.Router();

router.get("/petimage", getAllPets);

router.get("/search", searchPet);

router.get("/:id", petExist, getPetById);

router.use(validateSession);

router.post(
  "/savewithimage",
  upload.array("image", 4),
  createPetValidators,
  validateResult,
  createPet
);

router.patch(
  "/:id",
  petExist,
  protectAccountOwner,
  upload.array("image", 4),
  updatePet
);

router.delete("/pet_delete/:id", petExist, deletePet);

module.exports = router;
