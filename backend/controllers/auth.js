require('dotenv').config()
const jwt = require('jsonwebtoken');
const jwtSecrect = process.env.JWTSECRET
const authenticateToken = (req,res,next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    return res.status(401).json({error:'Acesso Negado 1'});
  }
jwt.verify(token, jwtSecrect,(err,user)=>{
  if(err){
    return res.status(403).json({erro:"Token invalido"});
  }
  req.user = user;
  next();
});
  
};
module.exports = {authenticateToken}