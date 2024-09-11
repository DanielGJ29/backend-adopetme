//Models
const { Species } = require("../apiServices/species/species.model");

//Utils
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.speciesExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const species = await Species.findOne({
    where: { status: "active", idSpecies: id },
  });

  if (!species) {
    return next(new AppError(404, `species con ID ${id} no existe`));
  }

  req.species = species;

  next();
});
