const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = 5000;
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const giaRoute = require('./routes/giaRoutes')
//const axios = require('axios');

const optCors = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(optCors));
// Configurar conexão com o banco de dados PostgreSQL
app.use('/thumbs', express.static(path.join(__dirname, 'public/thumbs')));
app.use('/Users',express.static(path.join(__dirname, 'public/Users')))
app.use(express.json());
const jwtSecrect = 'AnyRamdonWord';
app.use('/gia',giaRoute)
app.post('/cadastro',async(req,res)=>{
const {nome, email, senha} = req.body;

try{
  const hashedPassword = await bcrypt.hash(senha,10);
  await pool.query(`INSERT INTO tb_contas (nome,email,senha) VALUES ($1,$2,$3)`,[nome,email,hashedPassword]);
  res.status(202).json({message: "Usuario Cadastrado"})

}
catch(err){
  console.log('Erro ao registrar o usuario',err);
  res.status(500).json({error: 'Erro ao registrar o usuario'});
}



});
const authenticateToken = (req,res,next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
res.status(401).json({error:'Acesso Negado 1'});
  }
jwt.verify(token, jwtSecrect,(err,user)=>{
  if(err){
    return res.status(403).json({erro:"Token invalido"});
  }
  req.user = user;
  next();
});
  
};
app.post('/login',async(req,res)=>{
  const  {email,senha} = req.body;
  try{
   const result = await pool.query(`SELECT * FROM tb_contas WHERE email = $1 `,[email]);
   if(result.rows.length === 0){
    return res.status(400).json({erro: 'Usuario não Encontrado'});
   }
   const user = result.rows[0];
   const isValidPassword = await bcrypt.compare(senha,user.senha);
   if(!isValidPassword){
    return res.status(400).json({error:"Senha Incorreta"});
   }
   const token = jwt.sign({id_usuario: user.id_conta},jwtSecrect,{expiresIn: '1h'});
   user.token = token;
   res.json({user});
   
  }
  catch (err) {
    console.error('Erro ao fazer login', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});
// Exemplo de rota para obter usuários
app.get('/usuarios/:conta', authenticateToken ,async (req, res) => {  
  //console.log("sdsdsd");
  //res.json({ message: 'Bem-vindo ao dashboard', user: req.user });
  const {conta} = req.params;
  try {
    const result =  await pool.query(`
     SELECT u.id_user, nome,u.id_conta, ut.thumb_url
      FROM tb_user u
      JOIN tb_user_thumb ut ON u.id_user_thumb = ut.id_user_thumb 
      WHERE id_conta = $1
      ORDER BY id_user asc`,[conta]);
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar usuários', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
  });
app.get('/filmes',async(req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM tb_filmes');
    res.json(result.rows);
  }
  catch(err){
    console.error('Erro ao buscar filmes',err);
    res.status(500).json({error: 'Erro ao buscar filmes'});
  }
})
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
app.get('/filmes/categoria/:categoria',async(req,res)=>{
  const categoria = req.params.categoria;
  try{
    let result;
   if (categoria == "Todos"){
      result = await pool.query('SELECT * FROM tb_filmes');
      //console.log("todos");
    }
    else{
      result = await pool.query('SELECT f.id_filme, f.titulo, f.ano_lancamento, f.sinopse, f.url_filme, f.thumb_url FROM tb_filmes f JOIN tb_filme_genero fg ON f.id_filme = fg.id_filme JOIN tb_genero g ON fg.id_genero = g.id_genero WHERE g.nm_genero = $1',[categoria])
    }
    res.json(result.rows);
  }
  catch(err){
      console.error('Erro ao buscar categoria',err);
      res.status(500).json({error: "Erro ao buscar categoria"});
  }
})
app.get('/filmes/:id',async(req,res)=>{
  const id = req.params.id;
  try{
    const filmeR = await pool.query('SELECT id_filme,titulo,ano_lancamento,sinopse,thumb_url, duracao FROM tb_filmes WHERE id_filme = $1',[id]);
    const generoR = await pool.query(`
      SELECT g.nm_genero
      FROM tb_genero g
      JOIN tb_filme_genero fg ON g.id_genero = fg.id_genero
      JOIN tb_filmes f ON fg.id_filme = f.id_filme
      WHERE f.id_filme = $1
      `,[id]);
    const filme = filmeR.rows[0];
    const genero = generoR.rows.map(row => row.nm_genero);
    filme.genero = genero;
    res.json(filme);
  }
  catch(err){
    console.error('Erro ao buscar filmes',err);
    res.status(500).json({error: 'Erro ao buscar filmes'});
  }
})
app.get('/series/categoria/:categoria',async(req,res)=>{
  const categoria = req.params.categoria;
  try{
    let result;
   if (categoria == "Todos"){
      result = await pool.query('SELECT * FROM tb_series');
      //console.log("todos");
    }
    else{
      result = await pool.query(`
        SELECT s.id_serie, s.titulo, s.ano_lancamento, s.sinopse, s.thumb_url 
        FROM tb_series s 
        JOIN tb_serie_genero sg ON s.id_serie= sg.id_serie 
        JOIN tb_genero g ON sg.id_genero = g.id_genero 
        WHERE g.nm_genero = $1`,[categoria])
    }
    res.json(result.rows);
  }
  catch(err){
      console.error('Erro ao buscar categoria',err);
      res.status(500).json({error: "Erro ao buscar categoria"});
  }
})
app.get('/series/:id',async(req,res)=>{
  const id = req.params.id;
  try{
    const serieR = await pool.query(`
SELECT id_serie, titulo, ano_lancamento, sinopse, thumb_url, (SELECT COUNT(nm_temp)
    FROM tb_temporadas t
    JOIN tb_series s ON t.id_serie = s.id_serie) as TotalTemp
    FROM tb_series
    WHERE id_serie = $1
    `,[id]);
    const generoR = await pool.query(`
      SELECT g.nm_genero
      FROM tb_genero g
      JOIN tb_serie_genero fg ON g.id_genero = fg.id_genero
      JOIN tb_series f ON fg.id_serie = f.id_serie
      WHERE f.id_serie = $1
      `,[id]);
      const tempR = await pool.query(`
        SELECT t.id_temp
        FROM tb_series s
        JOIN tb_temporadas t ON t.id_serie = s.id_serie
        WHERE s.id_serie = $1
        `,[id])
    const serie = serieR.rows[0];
   const genero = generoR.rows.map(row => row.nm_genero);
   const temps = tempR.rows.map(row=>row.id_temp)
   serie.genero = genero;
   serie.temps = temps;
    res.json(serie);
  }
  catch(err){
    console.error('Erro ao buscar serie',err);
    res.status(500).json({error: 'Erro ao buscar serie'});
  }
})

app.get('/series/temporadas/:temp', async(req,res)=>{
 const temp = req.params.temp;
 try{
  const result = await pool.query(`
   SELECT e.id_ep, e.titulo, e.duracao, e.nm_ep, e.thumb_url, e.sinopse
      FROM tb_temporadas t
      JOIN tb_episodios e ON t.id_temp = e.id_temp
      JOIN tb_series s ON t.id_serie = s.id_serie
      WHERE t.id_temp = $1
      ORDER BY e.nm_ep asc 
    `,[temp])
    res.json(result.rows);
 }
 catch(err){
  console.error('Erro ao buscar serie',err);
  res.status(500).json({error: 'Erro ao buscar serie'});
}
})
app.get('/:user/series/temporadas/:temp',authenticateToken,async(req,res)=>{
  const {user,temp} = req.params
  try{
    const result = await pool.query(`
      SELECT e.id_ep, e.titulo, e.duracao, e.nm_ep, e.thumb_url, e.sinopse, h.tempo_assist
      FROM tb_temporadas t
      JOIN tb_episodios e ON t.id_temp = e.id_temp
      JOIN tb_series s ON t.id_serie = s.id_serie
	  LEFT JOIN  tb_historico h ON h.id_ep = e.id_ep AND h.id_user = $1
      WHERE t.id_temp = $2 
      ORDER BY e.nm_ep asc 
      `,[user,temp])
      res.json(result.rows);
  }
  catch(err){
    console.error('Erro ao buscar serie',err);
    res.status(500).json({error: 'Erro ao buscar serie'});
  }
})
app.get('/user/:id_usuario/historico',authenticateToken, async (req, res) => {
  const id_usuario = req.params.id_usuario;
  try {
    const result = await pool.query(`
SELECT 'Filme' AS tipo, f.id_filme AS id, f.titulo, NULL AS titulo_episodio, NULL AS nm_ep,duracao, a.tempo_assist, a.data_assist, NULL as nm_temp, f.thumb_url
      FROM tb_filmes f
      JOIN tb_historico a ON f.id_filme = a.id_filme
      WHERE a.id_user = $1
      UNION ALL
      SELECT 'Série' AS tipo, s.id_serie AS id, s.titulo, e.titulo AS titulo_episodio, e.nm_ep, e.duracao, h.tempo_assist, h.data_assist, t.nm_temp, e.thumb_url
      FROM tb_series s
      JOIN tb_temporadas t ON s.id_serie = t.id_serie
      JOIN tb_episodios e ON t.id_temp = e.id_temp
      JOIN tb_historico h ON e.id_ep = h.id_ep AND e.id_ep = (SELECT MAX(e.id_ep)
	  FROM tb_episodios e 
	  JOIN tb_historico h ON e.id_ep = h.id_ep
	  WHERE h.id_user = $1)
      WHERE h.id_user = $1
      ORDER BY data_assist DESC
    `, [id_usuario]);

   /* const assistidos = [...filmesResult.rows, ...seriesResult.rows];
    assistidos.sort((a, b) => new Date(b.data_assistido) - new Date(a.data_assistido));*/

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar assistidos', err);
    res.status(500).json({ error: 'Erro ao buscar assistidos' });
  }
});
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
app.get('/:user/favoritos',authenticateToken,async(req,res)=>{
  const id = req.params.user;
  try {
    const result = await pool.query(`
     SELECT 'Filme' AS tipo, f.id_filme AS id, f.titulo, f.thumb_url
      FROM tb_filmes f
      JOIN tb_favoritos a ON f.id_filme = a.id_filme
      WHERE a.id_user = $1
      UNION ALL
      SELECT 'Série' AS tipo, s.id_serie AS id, s.titulo, s.thumb_url
      FROM tb_series s
      JOIN tb_favoritos h ON s.id_serie = h.id_serie
      WHERE h.id_user = $1
      `,[id])
      res.json(result.rows);
  }
  catch (err) {
    console.error('Erro ao buscar assistidos', err);
    res.status(500).json({ error: 'Erro ao buscar assistidos' });
  }
})
app.post('/:user/favoritos/serie/:id',authenticateToken,async(req,res)=>{
  const {user,id} = req.params;
  try{
    await pool.query(`
      INSERT INTO tb_favoritos (id_user,id_serie) VALUES ($1,$2)
      `,[user,id])
      res.status(201).json({message:'Serie adicionada aos favoritos'})
  }
  catch (err) {
    console.error('Erro ao adicinar aos favoritos', err);
    res.status(500).json({ error: 'Erro ao adicionar aos favoritos' });
  }
})
app.post('/:user/favoritos/filmes/:id',authenticateToken, async(req,res)=>{
  const {user,id} = req.params;
  try{
    await pool.query(`
      INSERT INTO tb_favoritos (id_user,id_filme) VALUES ($1,$2)
      `,[user,id])
      res.status(201).json({message:'Filme adicionado aos favoritos'})
  }
  catch (err) {
    console.error('Erro ao adicinar aos favoritos', err);
    res.status(500).json({ error: 'Erro ao adicionar aos favoritos' });
  }
})
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
app.get('/usuarios/:conta/:perfil',authenticateToken,async(req,res)=>{
  const {conta,perfil} = req.params
  try{
    const result = await pool.query(`
      SELECT u.nome, u.id_user_thumb, ut.thumb_url
FROM tb_contas c
JOIN tb_user u ON c.id_conta = u.id_conta
JOIN tb_user_thumb ut ON u.id_user_thumb = ut.id_user_thumb
WHERE u.id_conta = $1 AND u.id_user = $2
      `,[conta,perfil]);
      res.json(result.rows[0]);
  }
  catch{
    console.error('Erro ao buscar perfil', err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
})
app.post('/usuarios/:idConta',authenticateToken,async(req,res)=>{
  const {nome,id_user_thumb} = req.body
  const{idConta} = req.params;
  try{
  await pool.query(`INSERT INTO tb_user (nome,id_conta,id_user_thumb) VALUES ($1,$2,$3)`,[nome,idConta,id_user_thumb,])
  res.status(201).json({message:'Perfil criado com sucesso'})
  }
  catch (err) {
    console.error('Erro ao criar perfil', err);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
})
app.put('/usuarios/:idConta/:perfil',authenticateToken,async(req,res)=>{
  const {nome,id_user_thumb} = req.body
  const{idConta,perfil} = req.params;
  try{
  await pool.query(`
   UPDATE tb_user
   SET nome = $1, id_user_thumb = $2
  WHERE id_user = $4 AND id_conta = $3
    `,[nome,id_user_thumb,idConta,perfil])
  res.status(201).json({message:'Perfil utualizado com sucesso'})
  }
  catch (err) {
    console.error('Erro ao editar perfil', err);
    res.status(500).json({ error: 'Erro ao editar perfil' });
  }
})
app.delete('/usuarios/:idConta/:perfil',authenticateToken,async(req,res)=>{
  const{idConta, perfil} = req.params;
  try{
    await pool.query(`
      DELETE FROM tb_user
      WHERE id_conta = $1 AND id_user = $2
      `,[idConta,perfil]);
      res.status(201).json({message:'Pefil apagado com sucesso'});
  }
  catch(err){
    console.log('Erro ao deletar o perfil', err);
    res.status(500).json({error:'Erro ao deletar perfil',err});
  }
})
app.delete('/:user/favoritos',authenticateToken,async(req,res)=>{
  const{user} = req.params;
  const{tipo,id} = req.body;
  try{
   if(tipo=='Filme'){
    await pool.query(`
      DELETE FROM tb_favoritos
      WHERE id_filme = $1 AND id_user = $2 
      `,[id,user])
   }
   else{
    await pool.query(`
      DELETE FROM tb_favoritos
      WHERE id_serie = $1 AND id_user = $2
      `,[id,user])
   }
   res.status(201).json({message:'Favorito Deletado com sucesso'})
  }
  catch(err){
    console.log('Erro ao deletar o perfil', err);
    res.status(500).json({error:'Erro ao deletar favorito',err});
  }
})

app.get('/stream/:caminho', async (req, res) => {
  const { caminho } = req.params;
  const { token, expires } = req.query;

  if (!token || !expires || Date.now() > parseInt(expires, 10)) {
    return res.status(403).json({ error: 'URL expirou ou não é válida' });
  }

  const secretKey = 'seu-segredo';
  const expectedToken = crypto
    .createHmac('sha256', secretKey)
    .update(`${caminho}-${expires}`)
    .digest('hex');

  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  const videoPath = `public/${caminho}`;
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.get('/reproduzir/:user/:tipo/:id',authenticateToken, async(req,res)=>{
  const {user,tipo,id} = req.params
  try{
    const table = tipo == 'filme' ? 'tb_filmes' : 'tb_episodios';
    const column = tipo == 'filme' ? 'id_filme' : 'id_ep';
   
    const resTemp = await pool.query(`
      SELECT h.tempo_assist
      FROM ${table} c
      JOIN tb_historico h ON c.${column} = h.${column}
      WHERE c.${column} = $1 AND id_user = $2
      `,[id,user]);
     
     
 
      if(resTemp.rows.length == 0){
    return res.json({tempo_assist:0})
      }
     
      res.json(resTemp.rows[0])
  }
  catch (err) {
    console.error('Erro ao encontrar url', err);
    res.status(500).json({ error: 'Erro ao encontrar url' });
  }
})

//URL CRIPTO
const crypto = require('crypto');

// Gerar URL temporária baseada no caminho
app.get('/get-video-url/:tipo/:id', authenticateToken, async (req, res) => {
  const { tipo, id } = req.params;
  const table = tipo === 'filme' ? 'tb_filmes' : 'tb_episodios';
  const column = tipo === 'filme' ? 'id_filme' : 'id_ep';
  const url = tipo === 'filme' ? 'url_filme' : 'url_episodio'
  try {
    // Buscar o caminho do banco de dados
    const result = await pool.query(`SELECT ${url} AS caminho FROM ${table} WHERE ${column} = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

   
    const videoPath = result.rows[0].caminho;

    // Configuração de validade da URL temporária
    const secretKey = 'seu-segredo';
    const expiresIn = 10 * 60 * 1000; // 10 minutos
    const expirationTime = Date.now() + expiresIn;

    // Criar token seguro
    const token = crypto
      .createHmac('sha256', secretKey)
      .update(`${videoPath}-${expirationTime}`)
      .digest('hex');

    // Criar URL assinada
    const baseUrl = 'http://localhost:5000/stream';
    const signedUrl = `${baseUrl}/${videoPath}?token=${token}&expires=${expirationTime}`;
    res.json({ signedUrl });
  } catch (err) {
    console.error('Erro ao gerar URL temporária:', err);
    res.status(500).json({ error: 'Erro ao gerar URL temporária' });
  }
});

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