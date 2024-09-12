const { DataTypes } = require("sequelize");
const { sequelize } = require("../../util/database");
//const { Pet } = require("../pet/pet.model");

const PetImage = sequelize.define("petImage", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  petId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: Pet,
    //   key: "id",
    // },
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { PetImage };
