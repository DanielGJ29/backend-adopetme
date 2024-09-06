const bycryp = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const dotenv = require("dotenv");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

//Models
const { Pet } = require("./pet.model.js");

//util
const { catchAsync } = require("../../util/catchAsync.js");
const { AppError } = require("../../util/appError.js");
const { storage } = require("../../util/firebase.js");
const { filterObj } = require("../../util/filterObj.js");
const {
  generateRefreshToken,
  generateToken,
} = require("../../util/tokenManager.js");
const { getUrl } = require("../../util/dowloadUrl.js");

const { Sequelize } = require("sequelize");

dotenv.config({ path: "./config.env" });

//?NEW PET
exports.createPet = catchAsync(async (req, res, next) => {
  const { name, age, description, gender, createdBy, longevity } = req.body;

  const petExist = await Pet.findOne({
    where: { status: "active", name },
  });

  if (petExist) {
    return next(
      new AppError(409, `Mascota: ${name} ya se encuentra registrada`)
    );
  }

  const PathsJson = {};
  const UrlsJson = {};
  if (req.files.length > 0) {
    const filePromise = req.files.map(async (file, index) => {
      //******************************** */
      let resultUploadBytes;
      let imgDownloadUrl;
      let countId = 0;
      if (req.files.length > 0) {
        const pet = await Pet.max("id");
        if (pet) {
          countId = pet + 1;
        } else {
          countId = 1;
        }
      }
      //********************************* */
      //Upload img to Cloud Storage (Firebase)

      const lastIndexExt = file.originalname.lastIndexOf(".");
      const ext = file.originalname.slice(lastIndexExt);

      const imgRef = ref(
        storage,
        `adopetme/pets/ID-${countId}-${Date.now()}-pet-${index + 1}${ext}`
      );

      resultUploadBytes = await uploadBytes(imgRef, file.buffer);

      //DowloanImg
      imgDownloadUrl = await getDownloadURL(imgRef);

      //arrayPath.push({ image: resultUploadBytes.metadata.fullPath });
      PathsJson[`image${index + 1}`] = resultUploadBytes.metadata.fullPath;
      //arrayUrl.push(imgDownloadUrl);
      UrlsJson[`image${index + 1}`] = imgDownloadUrl;

      return resultUploadBytes;
    });

    await Promise.all(filePromise);
  }

  //converte json to Array img
  arrayPath = Object.values(PathsJson);
  arrayUrl = Object.values(UrlsJson);

  const pet = await Pet.create({
    name,
    age,
    description,
    gender,
    createdBy,
    longevity,
    image: PathsJson,
  });

  pet.image = arrayUrl;

  res.status(200).json({
    status: "success",
    data: pet,
  });
});

//?GET ALL PETS
exports.getAllPets = catchAsync(async (req, res) => {
  const pets = await Pet.findAll({
    where: { status: "active" },
  });

  const petsPromises = pets.map(
    async ({
      id,
      name,
      age,
      description,
      gender,
      createdBy,
      longevity,
      image,
    }) => {
      //converte json to Array img
      arrayPath = Object.values(image);

      let urlsArray = [];
      if (arrayPath.length > 0) {
        const promiseUrl = arrayPath.map(async (path) => {
          url = await getUrl(path);
          urlsArray.push(url);
        });

        await Promise.all(promiseUrl);
      }

      console.log("urls", urlsArray);

      return {
        id,
        name,
        age,
        description,
        gender,
        createdBy,
        longevity,
        image: urlsArray,
      };
    }
  );

  const resolveUsers = await Promise.all(petsPromises);

  res.status(200).json({
    status: "success",
    data: resolveUsers,
  });
});

//?GET PET BY ID
exports.getPetById = catchAsync(async (req, res, next) => {
  const { pet } = req;

  //converte json to Array img
  arrayPath = Object.values(pet.image);

  const arrayUrls = [];
  if (arrayPath.length > 0) {
    const promiseUrl = arrayPath.map(async (path) => {
      url = await getUrl(path);
      arrayUrls.push(url);
    });

    await Promise.all(promiseUrl);
  }

  pet.image = arrayUrls;

  res.status(200).json({
    status: "success",
    data: pet,
  });
});

//?UPDATE PET
exports.updatePet = catchAsync(async (req, res, next) => {
  const { pet } = req;

  //console.log(req.body);

  //const { name, age, description, gender, createdBy, longevity } = pet;

  //Update Imgagen
  let newUrl = false;
  let resultUploadBytes;
  if (req.files.length > 0) {
    req.files.map((file) => {
      // console.log(file);
      // console.log(pet.image);
      //converte json to Array img
      arrayPath = Object.values(pet.image);
      //**************recorremos las path guardados
      arrayPath.map(async (path) => {
        const imgRef = ref(storage, path);
        console.log("imgRef", imgRef.fullPath);

        if (imgRef.fullPath) {
          console.log("actualizamos");
          //actualiza avatar si existe una url previamente registrada
          // const result = await uploadBytes(imgRef, req.file.buffer);
        } else {
          console.log("creamos url");
          //Create new url for the new avatar
          // const UserId = user.id;
          // //Upload img to Cloud Storage (Firebase)
          // const lastIndexExt = req.file.originalname.lastIndexOf(".");
          // const ext = req.file.originalname.slice(lastIndexExt);
          // const imgRef = ref(
          //   storage,
          //   `adopetme/pets/ID-${UserId}-${Date.now()}-pet.${ext}`
          // );
          // resultUploadBytes = await uploadBytes(imgRef, req.file.buffer);
          // //DowloanImg
          // const imgDownloadUrl = await getDownloadURL(imgRef);
        }
      });
    });

    //const imgRef = ref(storage, pet.avatarUrl);
  }

  const data = filterObj(
    req.body,
    "name",
    "age",
    "description",
    "gender",
    "createdBy",
    "longevity"
  );

  // if (resultUploadBytes) {
  //   data.avatarUrl = resultUploadBytes.metadata.fullPath;
  // }

  //await pet.update({ ...data });

  res.status(200).json({ status: "success" });
});

//?DELETE PET
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  user.update({ status: "delete" });

  res.status(200).json({
    status: "success",
  });
});
