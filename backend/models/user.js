'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Ejemplo más adelante: User.hasMany(models.Event, { foreignKey: 'creatorId' });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email:    { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role:     { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    }
  );
  return User;
};
