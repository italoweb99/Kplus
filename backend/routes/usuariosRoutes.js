const express = require('express')
const pool = require('../db')
const { authenticateToken } = require('../controllers/auth')
const router = express.Router()
router.get('/:conta', authenticateToken ,async (req, res) => {  
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
  router.get('/:conta/:perfil',authenticateToken,async(req,res)=>{
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
router.post('/:idConta',authenticateToken,async(req,res)=>{
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
router.put('/:idConta/:perfil',authenticateToken,async(req,res)=>{
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
router.delete('/:idConta/:perfil',authenticateToken,async(req,res)=>{
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




module.exports = router