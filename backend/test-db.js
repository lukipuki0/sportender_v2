// backend/test-db.js
import db from './models/index.js';

(async () => {
  try {
    // ① Verificar autenticación
    await db.sequelize.authenticate();
    console.log('✅ Conexión a la base de datos OK.');

    // ② Mostrar los nombres de los modelos cargados
    console.log('Modelos registrados:', Object.keys(db));

    // ③ Hacer un conteo de registros (inicialmente vacíos)
    const countUsers = await db.User.count();
    const countEvents = await db.Event.count();
    console.log(`Hay ${countUsers} usuario(s) en la tabla Users.`);
    console.log(`Hay ${countEvents} evento(s) en la tabla Events.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al probar la base de datos:', error);
    process.exit(1);
  }
})();
