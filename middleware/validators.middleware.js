const { body, validationResult } = require("express-validator");

//Utils
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.createUserValidators = [
  body("firstname")
    .isString()
    .withMessage("firstname must by a string")
    .notEmpty()
    .withMessage("Must provide a valid firstname"),
  body("lastname")
    .isString()
    .withMessage("Last Name must by a string")
    .notEmpty()
    .withMessage("Last Name provide a valid Last Name"),
  body("username")
    .isString()
    .withMessage("username  must by a string")
    .notEmpty()
    .withMessage("username provide a valid Mother Last Name"),
  body("email")
    .isString()
    .withMessage("Email must by a string")
    .notEmpty()
    .withMessage("Email provide a valid email"),
  body("phone")
    .isString()
    .withMessage("phone must by a string")
    .notEmpty()
    .withMessage("phone provide a valid phone"),
  body("password")
    .isString()
    .withMessage("Password must by a string")
    .notEmpty()
    .withMessage("Password provide a valid Password"),
  body("country")
    .isString()
    .withMessage("country must by a string")
    .notEmpty()
    .withMessage("country provide a valid country"),
  body("city")
    .isString()
    .withMessage("city must by a string")
    .notEmpty()
    .withMessage("city provide a valid city"),
  body("rol")
    .isString()
    .withMessage("Rol must by a string")
    .notEmpty()
    .withMessage("Rol provide a valid Rol"),
];

exports.createPetValidators = [
  body("name")
    .isString()
    .withMessage("Name must by a string")
    .notEmpty()
    .withMessage("Must provide a valid name"),
  // body("age")
  //   .isNumeric()
  //   .withMessage("age must by a number")
  //   .notEmpty()
  //   .withMessage("age provide a valid age"),
  // body("longevity")
  //   .isString()
  //   .withMessage("Longevity must by a string")
  //   .notEmpty()
  //   .withMessage("longevity provide a valid longevity"),
  body("description")
    .isString()
    .withMessage("description must by a string")
    .notEmpty()
    .withMessage("description provide a valid description"),
  body("gender")
    .isString()
    .withMessage("gender must by a string")
    .notEmpty()
    .withMessage("gender provide a valid gender"),
  body("createdBy")
    .isNumeric()
    .withMessage("createdBy must by a number")
    .notEmpty()
    .withMessage("createdBy provide a valid number"),
  // body("image")
  //   .isImage()
  //   .withMessage("image must by a image")
  //   .notEmpty()
  //   .withMessage("image provide a valid image"),
];

exports.validateResult = catchAsync(async (req, res, next) => {
  //Validate req.body
  const errors = validationResult(req);

  const errorMsg = errors
    .array()
    .map(({ msg }) => msg)
    .join(". ");
  if (!errors.isEmpty()) {
    return next(new AppError(400, errorMsg));
  }
  next();
});
