const { DataTypes } = require("sequelize");
const { sequelize } = require("../../util/database");
const { PetImage } = require("../image/petImage.model");

const Pet = sequelize.define("pet", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  longevity: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },

  gender: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idSpecies: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "active",
  },
});

// Definir la asociación
Pet.hasMany(PetImage, { foreignKey: "petId", as: "images" });
PetImage.belongsTo(Pet, { foreignKey: "petId", as: "pet" });

module.exports = { Pet };
