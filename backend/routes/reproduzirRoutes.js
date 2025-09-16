const express = require('express')
const pool = require('../db')
const router = express.Router()
const crypto = require('crypto');
const { authenticateToken } = require('../controllers/auth');
const fs = require('fs');
router.get('/stream/:caminho', async (req, res) => {
 
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

  const videoPath = `public/videos/${caminho}`;
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

router.get('/:user/:tipo/:id',authenticateToken, async(req,res)=>{
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
     else{
      res.json(resTemp.rows[0])
     }
  }
  catch (err) {
    console.error('Erro ao encontrar url', err);
    res.status(500).json({ error: 'Erro ao encontrar url' });
  }
})

//URL CRIPTO


// Gerar URL temporária baseada no caminho
router.get('/get-video-url', authenticateToken, async (req, res) => {
  const { tipo, id } = req.query;
  
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
    const baseUrl = 'http://localhost:5000/reproduzir/stream';
    const signedUrl = `${baseUrl}/${videoPath}?token=${token}&expires=${expirationTime}`;
    res.json({ signedUrl });
  } catch (err) {
    console.error('Erro ao gerar URL temporária:', err);
    res.status(500).json({ error: 'Erro ao gerar URL temporária' });
  }
});
router.post('/saveTempo',authenticateToken,async(req,res)=>{
  const {video_id,tempo_assist,id_user,tipo} = req.body
  console.log(video_id,tempo_assist,id_user,tipo)
  const tipo_video = tipo === "filme" ? 'id_filme': 'id_ep'
   try{
    await pool.query(`INSERT INTO tb_historico (id_user,${tipo_video},tempo_assist) VALUES($3,$2,$1) ON 
      CONFLICT (id_user, ${tipo_video}) DO UPDATE SET tempo_assist = $1 WHERE tb_historico.id_user = $3 AND tb_historico.${tipo_video} = $2` ,[tempo_assist,video_id,id_user])
    res.status(200)
   }
   catch(err){
    console.log(err)
    res.status(500)
   }
})


module.exports = router