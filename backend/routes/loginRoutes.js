require('dotenv').config()
const express = require('express')
const pool = require('../db')
const { authenticateToken } = require('../controllers/auth')
const jwt = require('jsonwebtoken')
const router = express.Router()
const jwtSecrect = process.env.JWTSECRET
const bcrypt = require('bcryptjs');
router.post('/',async(req,res)=>{
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
module.exports = router