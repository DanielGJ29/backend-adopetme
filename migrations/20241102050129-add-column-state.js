"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "state", {
      type: Sequelize.STRING, // Puedes cambiar el tipo según tus necesidades
      allowNull: true, // Cambia a false si no quieres permitir valores nulos
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "state");
  },
};
