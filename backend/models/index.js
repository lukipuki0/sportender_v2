// backend/models/index.js
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';

// 1. Ruta absoluta al config.json
const configPath = path.join(__dirname, '/../config/config.json');
// 2. Leer el archivo y parsear JSON
const configJSON = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
// 3. Tomar la sección según el entorno
const config = configJSON[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Cargar cada archivo de modelo (excepto index.js)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(async (file) => {
    // Construir la ruta absoluta al archivo del modelo
    const modelPath = path.join(__dirname, file);
    // Convertir a file:// URL
    const modelURL = url.pathToFileURL(modelPath).href;
    // Importar dinámicamente usando el URL válido
    const modelModule = await import(modelURL);
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Ejecutar associate() para que se creen relaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
