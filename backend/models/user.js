'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Event, {
        foreignKey: 'creatorId',
        as: 'createdEvents'
      });

      User.belongsToMany(models.Event, {
        through: models.UserEvent,
        foreignKey: 'userId',
        as: 'participatingEvents'
      });
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
