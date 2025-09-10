const {Pool} = require('pg')
require('dotenv').config()
const {Client} = require('pg')
const pool = new Client({
  connectionString: process.env.CONNECTIONSTRING
  
})
async function  connetSupa(){
try{
  pool.connect()
}
catch(err){
  console.log(err)
}
}
connetSupa()
module.exports = pool
// Configurar conexão com o banco de dados PostgreSQL
/*const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kplus',
  password: 'Itajujmv1',
  port: 5432,
});

module.exports = pool;*/