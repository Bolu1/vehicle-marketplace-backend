const Pool = require('pg').Pool
import settings from './settings';

const pool = new Pool({
  user: settings.databaseUsername,
  host: settings.databaseHost,
  database: settings.databaseName,
  password: settings.databasePassword,
  port: settings.databasePort,
});

export default pool;