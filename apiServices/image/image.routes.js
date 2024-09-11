const express = require("express");

//Controllers
const {
  updateImage,
  addImage,
  deleteImage,
} = require("../image/image.controller");

//Middlewares
const { validateSession } = require("../../middleware/auth.middlewares");
const { petImageExist } = require("../../middleware/image.middlewares");

//Utils
const { upload } = require("../../util/multer");
const { petExist } = require("../../middleware/pet.middleware");

const router = express.Router();

router.use(validateSession);

router.post("/image_add/:id", petExist, upload.single("image", 1), addImage);

router.patch("/:id", petImageExist, upload.single("image", 1), updateImage);

router.delete("/image_delete/:id", petImageExist, deleteImage);

module.exports = router;
