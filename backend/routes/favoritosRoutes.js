const express = require('express')
const pool =require('../db')
const { authenticateToken } = require('../controllers/auth')
const router = express.Router()

router.get('/:user',authenticateToken,async(req,res)=>{
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
router.post('/:user/serie/:id',authenticateToken,async(req,res)=>{
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
router.post('/:user/filmes/:id',authenticateToken, async(req,res)=>{
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
router.delete('/:user',authenticateToken,async(req,res)=>{
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
router.get('/:user/all',authenticateToken,async(req,res)=>{
  const {user} = req.params
  try{
    const result = await pool.query('SELECT* FROM tb_favoritos WHERE id_user = $1',[user])

    res.status(200).json(result.rows)
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"erro ao obter favoritos"})
  }
})


module.exports = router