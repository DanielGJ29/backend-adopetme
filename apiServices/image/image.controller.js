const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

//Models
const { PetImage } = require("../image/petImage.model.js");

//util
const { catchAsync } = require("../../util/catchAsync.js");
const { AppError } = require("../../util/appError.js");
const { storage } = require("../../util/firebase.js");
const { getUrl } = require("../../util/dowloadUrl.js");
const { Sequelize } = require("sequelize");

//?ADD IMAGEN PET
exports.addImage = catchAsync(async (req, res, next) => {
  const { pet, currentUser } = req;

  const file = req.file;

  if (pet.images.length >= 4) {
    return next(
      new AppError(
        400,
        `Mascota: ${pet.name} tiene el limite de imagenes permitidas`
      )
    );
  }

  const countPet = await PetImage.count({
    where: {
      petId: pet.id,
    },
  });

  const lastIndexExt = file.originalname.lastIndexOf(".");
  const ext = file.originalname.slice(lastIndexExt);

  const imgRef = ref(
    storage,
    `adopetme/pets/ID-${pet.id}-${Date.now()}-pet-${countPet + 1}${ext}`
  );

  resultUploadBytes = await uploadBytes(imgRef, file.buffer);
  imgDownloadUrl = await getDownloadURL(imgRef);

  const petImg = await PetImage.create({
    petId: pet.id,
    image: resultUploadBytes.metadata.fullPath,
  });

  if (!petImg) {
    return next(new AppError(400, `ocurrio un error`));
  }

  const newImages = [];
  await Promise.all(
    pet.images.map(async (img) => {
      const id = img.id;
      const image = await getUrl(img.image);
      newImages.push({ id: id, image: image });
    })
  );

  newImages.push({ id: petImg.id, image: imgDownloadUrl });

  const result = {
    id: pet.id,
    name: pet.name,
    age: pet.age,
    longevity: pet.longevity,
    description: pet.description,
    gender: pet.gender,
    size: pet.size,
    createdBy: pet.createdBy,
    status: pet.status,
    ubicacion: pet.ubicacion,
    images: newImages,
  };

  res.status(200).json({
    status: "success",
    data: result,
  });
});

//?UPDATE IMAGEN PET BY ID
exports.updateImage = catchAsync(async (req, res, next) => {
  const { petImage } = req;

  const file = req.file;
  console.log("petImag", petImage.image);
  console.log("FILE", file);

  const imgRef = ref(storage, petImage.image);
  const result = await uploadBytes(imgRef, req.file.buffer);

  res.status(200).json({
    status: "success",
  });
});

//?DELETE IMAGE
exports.deleteImage = catchAsync(async (req, res, next) => {
  const { petImage } = req;

  //delete path image from starage
  // Create a reference to the file to delete
  const desertRef = ref(storage, petImage.image);

  // Delete the file
  deleteObject(desertRef)
    .then(async () => {
      // File deleted successfully
      //delete image from petImage table
      const result = await PetImage.destroy({
        where: {
          id: petImage.id,
        },
      });

      res.status(200).json({
        status: "success",
      });
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      return next(new AppError(400, error));
    });
});
