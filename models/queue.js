'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    freezeTableName= true;
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Queue.init({
    guildId: DataTypes.STRING,
    clientId: DataTypes.STRING,
    path: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Queue',
    indexes: [
      {
        unique: false,
        fields: ['guildId']
      },
      {
        unique: false,
        fields: ['clientId']
      }
    ]
  });
  return Queue;
};