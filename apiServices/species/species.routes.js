const express = require("express");

//Controllers
const { getAllSpecies, getSpeciesById } = require("./species.controller");

//Middlewares
const { validateSession } = require("../../middleware/auth.middlewares");

const { speciesExist } = require("../../middleware/species.middleware");

const router = express.Router();

router.use(validateSession);

router.get("/", getAllSpecies);

router.get("/:id", speciesExist, getSpeciesById);

module.exports = router;
