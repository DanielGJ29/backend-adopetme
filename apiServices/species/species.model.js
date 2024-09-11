const { DataTypes } = require("sequelize");
const { sequelize } = require("../../util/database");

//Models
const { Pet } = require("../pet/pet.model");

const Species = sequelize.define("specie", {
  idSpecies: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "active",
  },
});

// Definir la asociación
Species.hasOne(Pet, { foreignKey: "idSpecies" });
Pet.belongsTo(Species, { foreignKey: "idSpecies", as: "specie" });

module.exports = { Species };
