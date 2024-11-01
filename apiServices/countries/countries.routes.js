const express = require("express");

//Controllers
const {
  getAllCountries,
  getAllStateByCountry,
  getallCitiesByState,
} = require("./countries.controller");

//Middlewares
// const {
//   validateSession,
//   protecAdmin,
// } = require("../../middleware/auth.middlewares");

// const {
//   createPetValidators,
//   validateResult,
// } = require("../../middleware/validators.middleware");

// const { petExist } = require("../../middleware/pet.middleware");

const router = express.Router();

router.get("/all", getAllCountries);

router.get("/state/:country", getAllStateByCountry);

router.get("/cities/:state", getallCitiesByState);

// router.get("/search", searchPet);

// router.get("/:id", petExist, getPetById);

// router.use(validateSession);

// router.post(
//   "/savewithimage",
//   upload.array("image", 4),
//   createPetValidators,
//   validateResult,
//   createPet
// );

// router.patch(
//   "/:id",
//   petExist,
//   protectAccountOwner,
//   upload.array("image", 4),
//   updatePet
// );

// router.delete("/pet_delete/:id", petExist, deletePet);

module.exports = router;
