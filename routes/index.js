const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const removeExtension = (fileName) => fileName.split(".").shift();
const patchRouterApiServices = path.resolve("apiServices");
fs.readdirSync(patchRouterApiServices).filter((folder) => {
  const pathRouterChildren = path.resolve("apiServices", folder);
  const subFolder = fs.readdirSync(pathRouterChildren);
  const onlyRoutes = subFolder.filter((file) => file.includes("routes"))[0];

  if (onlyRoutes) {
    const nameRoute = removeExtension(onlyRoutes);
    // console.log("nameService---->", folder); //auth
    // console.log("file---->", onlyRoutes); //create.routes
    // console.log("name ruta", nameRoute); //create
    router.use(
      `/${nameRoute}`,
      require(`../apiServices/${nameRoute}/${nameRoute}.routes`)
    ); //TODO localhost/user
  }
});

//?Funciona cuando las rutas estan en la misma carpetas
//const pathRouter = `${__dirname}`;
// fs.readdirSync(pathRouter).filter((file) => {
//   const fileWithOutExt = removeExtension(file);
//   const skip = ["index"].includes(fileWithOutExt);

//   if (!skip) {
//     console.log("file---->", fileWithOutExt);
//     router.use(
//       `/${fileWithOutExt}`,
//       require(`./apiServices/${fileWithOutExt}/${fileWithOutExt}.routes`)
//     ); //TODO localhost/user
//   }
// });

router.get("*", (req, res) => {
  res.status(400);
  res.send({ error: "Not found the point" });
});

module.exports = router;
