// backend/src/models/userEvent.js
export default (sequelize, DataTypes) => {
  const UserEvent = sequelize.define(
    'UserEvent',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Events', key: 'id' }
      }
    },
    { tableName: 'UserEvents', timestamps: false }
  );
  return UserEvent;
};