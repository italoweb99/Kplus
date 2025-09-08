const express =require('express')
const pool = require('../db')
const router = express.Router()
const bcrypt = require('bcryptjs');

router.post('/cadastro',async(req,res)=>{
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

module.exports = router