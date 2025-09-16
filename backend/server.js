const express = require('express');
const pool = require('./db');
const app = express();

const {authenticateToken} = require('./controllers/auth')
const port = 5000;
const cors = require('cors');

const path = require('path');
const seriesRoutes = require('./routes/seriesRoutes')
const cadastroRoutes =require('./routes/cadastroRoutes')
const giaRoute = require('./routes/giaRoutes')
const filmesRoutes = require('./routes/filmesRoutes')
const loginRoutes = require('./routes/loginRoutes')
const usuariosRoutes = require('./routes/usuariosRoutes')
const favoritosRoutes = require('./routes/favoritosRoutes')
const historicoRoutes = require('./routes/historicoRoutes')
const reproduzirRoutes = require('./routes/reproduzirRoutes')
//const axios = require('axios');

const optCors = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(optCors));
// Configurar conexão com o banco de dados PostgreSQL
//app.use('/videos',express.static(path.join(__dirname,'public/videos')))
app.use('/thumbs', express.static(path.join(__dirname, 'public/thumbs')));
app.use('/Users',express.static(path.join(__dirname, 'public/Users')))
app.use(express.json());
app.use('/login',loginRoutes)
app.use('/cadastro',cadastroRoutes)
app.use('/filmes',filmesRoutes)
app.use('/gia',giaRoute)
app.use('/series',seriesRoutes)
app.use('/usuarios',usuariosRoutes)
app.use('/favoritos',favoritosRoutes)
app.use('/historico',historicoRoutes)
app.use('/reproduzir',reproduzirRoutes)
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
// Exemplo de rota para obter usuários




app.get('/destaques', async (req, res) => {
 
  try {
    const result = await pool.query(`
    SELECT 'Filme' AS tipo, f.id_filme AS id, f.titulo, a.data_add, f.thumb_url
      FROM tb_filmes f
      JOIN tb_destaques a ON f.id_filme = a.id_filme
      UNION ALL
      SELECT 'Série' AS tipo, s.id_serie AS id, s.titulo, h.data_add, s.thumb_url
      FROM tb_series s
      JOIN tb_destaques h ON s.id_serie = h.id_serie 
      ORDER BY data_add DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar assistidos', err);
    res.status(500).json({ error: 'Erro ao buscar assistidos' });
  }
});

app.get('/userthumbs',authenticateToken,async(req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM tb_user_thumb');
    res.json(result.rows);
  }
  catch (err) {
    console.error('Erro ao buscar thumb', err);
    res.status(500).json({ error: 'Erro ao buscar thumbs' });
  }
})


app.get('/generos',async(req,res)=>{
  try{
  const result = await pool.query('SELECT* FROM tb_genero ORDER BY id_genero ASC')
  res.status(200).json(result.rows)
  }
  catch(err){
    console.log(err)
    res.status(500).json({message: 'Erro ao obter generos'})
  }
})