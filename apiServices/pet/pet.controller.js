const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

//Models
const { Pet } = require("./pet.model.js");
const { User } = require("../../apiServices/auth/user.model.js");
const { PetImage } = require("../image/petImage.model.js");
const { Species } = require("../species/species.model.js");

//util
const { catchAsync } = require("../../util/catchAsync.js");
const { AppError } = require("../../util/appError.js");
const { storage } = require("../../util/firebase.js");
const { filterObj } = require("../../util/filterObj.js");
const { getUrl } = require("../../util/dowloadUrl.js");

//?NEW PET
exports.createPet = catchAsync(async (req, res, next) => {
  const { name, age, description, gender, longevity } = req.body;
  const createdBy = Number(req.body.createdBy);
  const idSpecies = Number(req.body.idSpecies);
  const user = req.currentUser;

  const petExist = await Pet.findOne({
    where: { status: "active", name, createdBy: user.id },
  });

  if (petExist) {
    return next(
      new AppError(409, `Mascota: ${name} ya se encuentra registrada`)
    );
  }

  const arrayPath = [];
  const arrayUrl = [];
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

      arrayPath.push({ image: resultUploadBytes.metadata.fullPath });
      arrayUrl.push(imgDownloadUrl);

      return resultUploadBytes;
    });

    await Promise.all(filePromise);
  }

  const pet = await Pet.create(
    {
      name,
      age,
      description,
      gender,
      createdBy,
      longevity,
      idSpecies,
      images: arrayPath,
    },
    {
      include: [
        {
          model: PetImage,
          as: "images",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    }
  );

  const paths = [];

  await Promise.all(
    pet.images.map(async (img) => {
      paths.push({ petId: img.petId, image: await getUrl(img.image) });
    })
  );

  pet.images = paths;

  res.status(200).json({
    status: "success",
    data: pet,
  });
});

//?GET ALL PETS
exports.getAllPets = catchAsync(async (req, res) => {
  const pets = await Pet.findAll({
    where: { status: "active" },
    include: [
      {
        model: User,
        as: "ubicacion",
        attributes: ["country", "city"],
      },
      {
        model: PetImage,
        as: "images",
        attributes: ["id", "image"],
      },
      {
        model: Species,
        as: "specie",
        attributes: ["idSpecies", "name"],
      },
    ],
    exclude: ["idSpecies"],
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
      ubicacion,
      idSpecies,
      specie,
      images,
    }) => {
      let urlsArray = [];
      if (images.length > 0) {
        const promiseUrl = images.map(async (path) => {
          url = await getUrl(path.image);
          urlsArray.push({ id: path.id, image: url });
        });

        await Promise.all(promiseUrl);
      }

      let genderUpperCase = gender.toUpperCase();

      return {
        id,
        name,
        age,
        description,
        gender,
        createdBy,
        longevity,
        ubicacion,
        idSpecies,
        specie,
        images: urlsArray,
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
  //arrayPath = Object.values(pet.image);
  //console.log("pet.images", pet.images);

  const arrayUrls = [];
  if (pet.images.length > 0) {
    await Promise.all(
      pet.images.map(async (path) => {
        url = await getUrl(path.image);

        arrayUrls.push({ id: path.id, image: url });
      })
    );

    //await Promise.all(promiseUrl);
  }

  console.log(arrayUrls);
  const petWithUrl = {
    id: pet.id,
    name: pet.name,
    age: pet.age,
    longevity: pet.longevity,
    description: pet.description,
    gender: pet.gender,
    size: pet.size,
    createdBy: pet.createdBy,
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
    ubicacion: pet.ubicacion,
    //idSpecies: pet.idSpecies,
    specie: pet.specie,
    images: arrayUrls,
  };

  res.status(200).json({
    status: "success",
    data: petWithUrl,
  });
});

//?UPDATE PET
exports.updatePet = catchAsync(async (req, res, next) => {
  const { pet } = req;

  const data = filterObj(
    req.body,
    "name",
    "age",
    "description",
    "gender",
    "createdBy",
    "longevity",
    "idSpecies"
  );

  await pet.update({ ...data });

  res.status(200).json({ status: "success" });
});

//?DELETE PET
exports.deletePet = catchAsync(async (req, res, next) => {
  const { pet } = req;

  pet.update({ status: "delete" });

  res.status(200).json({
    status: "success",
  });
});

//?SEARCH PET
exports.searchPet = catchAsync(async (req, res, next) => {
  //const { pet } = req;
  //const params = req.params;
  const param = req.query.param.toLowerCase();

  // if(param !== "perro" || param !== 'gato'){
  //   return next(
  //     new AppError(400, `Mascota: ${name} ya se encuentra registrada`)
  //   );
  // }

  const id = param === "perro" ? 2 : param === "gato" ? 1 : 0;

  const pets = await Pet.findAll({
    where: {
      idSpecies: id,
    },
    include: [
      {
        model: User,
        as: "ubicacion",
        attributes: ["country", "city"],
      },
      {
        model: PetImage,
        as: "images",
        attributes: ["id", "image"],
      },
      {
        model: Species,
        as: "specie",
        attributes: ["idSpecies", "name"],
      },
    ],
    exclude: ["idSpecies"],
  });

  //GET URL IMG
  const petsPromises = pets.map(
    async ({
      id,
      name,
      age,
      description,
      gender,
      createdBy,
      longevity,
      ubicacion,
      //idSpecies,
      specie,
      images,
    }) => {
      let urlsArray = [];
      if (images.length > 0) {
        const promiseUrl = images.map(async (path) => {
          url = await getUrl(path.image);
          urlsArray.push({ id: path.id, image: url });
        });

        await Promise.all(promiseUrl);
      }

      let genderUpperCase = gender.toUpperCase();

      return {
        id,
        name,
        age,
        description,
        gender,
        createdBy,
        longevity,
        ubicacion,
        //idSpecies,
        specie,
        images: urlsArray,
      };
    }
  );

  const resolvePets = await Promise.all(petsPromises);

  res.status(200).json({
    status: "success",
    data: resolvePets,
  });
});
