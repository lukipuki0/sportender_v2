'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Un Event pertenece a un User (creador)
      Event.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator'
      });
    }
  }

  Event.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sportType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',   // nombre de la tabla Users
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'Events'
    }
  );

  return Event;
};
