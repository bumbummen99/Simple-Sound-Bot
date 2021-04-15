'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Videos', // table name
        'description', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Videos', 'description'),
    ]);
  }
};
