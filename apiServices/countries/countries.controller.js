//util
const { catchAsync } = require("../../util/catchAsync.js");
const { AppError } = require("../../util/appError.js");
const {
  getallCountries,
  getallState,
  getallCities,
} = require("../../util/apirestCountries.js");

//?GET ALL COUNTRIES
exports.getAllCountries = catchAsync(async (req, res) => {
  const countries = await getallCountries();

  res.status(200).json({
    status: "success",
    data: countries,
  });
});

exports.getAllStateByCountry = catchAsync(async (req, res) => {
  const { country } = req.params;

  const newCountry = country.trim();

  const states = await getallState(newCountry);
  res.status(200).json({
    status: "success",
    data: states,
  });
});

exports.getallCitiesByState = catchAsync(async (req, res) => {
  const { state } = req.params;

  const cities = await getallCities(state);

  res.status(200).json({
    status: "success",
    data: cities,
  });
});
