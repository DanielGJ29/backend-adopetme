//Models
const { PetImage } = require("../apiServices/image/petImage.model");

//Utils
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.petImageExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const petImage = await PetImage.findOne({
    where: { status: "active", id },
  });

  if (!petImage) {
    return next(new AppError(404, `Imagen con ID ${id} no existe`));
  }

  req.petImage = petImage;

  next();
});
