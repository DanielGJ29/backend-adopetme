//Models
const { Species } = require("./species.model.js");

//util
const { catchAsync } = require("../../util/catchAsync.js");
const { AppError } = require("../../util/appError.js");

//?GET ALL ESPECIES
exports.getAllSpecies = catchAsync(async (req, res) => {
  const species = await Species.findAll({
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: species,
  });
});

//?GET SPECIES BY ID
exports.getSpeciesById = catchAsync(async (req, res, next) => {
  const { species } = req;

  res.status(200).json({
    status: "success",
    data: species,
  });
});
