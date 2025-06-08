// backend/models/index.js
import Sequelize from 'sequelize';
import UserModel from './user.js';
import EventModel from './event.js';
import UserEventModel from './userEvent.js';
import { createRequire } from 'module';
import process from 'process';
import path from 'path';
import url from 'url';

const require = createRequire(import.meta.url);

const __filename = url.fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const env        = process.env.NODE_ENV || 'development';
const config     = require(path.join(__dirname, '../config/config.json'))[env];
const sequelize  = new Sequelize(config.database, config.username, config.password, config);

const User      = UserModel(sequelize, Sequelize.DataTypes);
const Event     = EventModel(sequelize, Sequelize.DataTypes);
const UserEvent = UserEventModel(sequelize, Sequelize.DataTypes);

const db = { User, Event, UserEvent };

if (User.associate)      User.associate(db);
if (Event.associate)     Event.associate(db);
if (UserEvent.associate) UserEvent.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
