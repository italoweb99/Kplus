const {Pool} = require('pg')


// Configurar conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kplus',
  password: 'Itajujmv1',
  port: 5432,
});

module.exports = pool;