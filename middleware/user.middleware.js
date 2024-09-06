//Models
const { User } = require("../apiServices/auth/user.model");

//Utils
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { status: "active", id },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return next(new AppError(404, `Usuario con ID ${id} no existe`));
  }

  req.user = user;

  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  if (currentUser.rol !== "admin" && currentUser.id !== +id) {
    return next(new AppError(403, "no autorizado para editar"));
  }

  next();
});
