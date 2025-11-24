// carregamento opcional do .env (não quebra se dotenv não estiver instalado)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv não disponível em produção — ok se variáveis vierem do ambiente
}

const express = require('express');
const pool = require('./db');
const app = express();

const {authenticateToken} = require('./controllers/auth')
// usa PORT do ambiente (Render define PORT)
const port = process.env.PORT || 5000;
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

// origin configurável por env (defina FRONTEND_ORIGIN em Render)
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.VITE_APP_ORIGIN || '*';

// Configura CORS com suporte a preflight PNA
const optCors = {
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(optCors));

// middleware para responder preflight e Access-Control-Allow-Private-Network
app.options('*', (req, res) => {
  const origin = req.headers.origin || ALLOWED_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Range');

  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  return res.sendStatus(204);
});

// rota de health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

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
// Rota de busca por filmes ou séries
app.get('/search', async (req, res) => {
  const { query, page } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Parâmetro query é obrigatório.' });
  }
  // Paginação segura
  const pageNum = parseInt(page) || 1;
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  try {
    // Busca filmes
    const filmes = await pool.query(
      `SELECT 'filme' as tipo, id_filme as id, titulo, sinopse, thumb_url 
       FROM tb_filmes 
       WHERE LOWER(titulo) LIKE LOWER($1)
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );
    // Busca séries
    const series = await pool.query(
      `SELECT 'serie' as tipo, id_serie as id, titulo, sinopse, thumb_url 
       FROM tb_series 
       WHERE LOWER(titulo) LIKE LOWER($1)
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );
    res.json({ filmes: filmes.rows, series: series.rows });
  } catch (err) {
    console.error('Erro ao buscar filmes/séries', err);
    res.status(500).json({ error: 'Erro ao buscar filmes/séries' });
  }
});