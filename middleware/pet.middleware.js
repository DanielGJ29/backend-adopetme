//Models
const { Pet } = require("../apiServices/pet/pet.model");

//Utils
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.petExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const pet = await Pet.findOne({
    where: { status: "active", id },
    //incluir la ubication del usuario
  });

  if (!pet) {
    return next(new AppError(404, `Mascota con ID ${id} no existe`));
  }

  req.pet = pet;

  next();
});
