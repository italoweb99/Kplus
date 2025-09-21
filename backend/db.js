const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.CONNECTIONSTRING
});

pool.on('error',(err,client)=>{
  console.log('Erro inesperado no pool',err)
})

module.exports = pool;