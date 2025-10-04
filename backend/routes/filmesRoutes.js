const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../controllers/auth');
const router = express.Router()


router.get('/',async(req,res)=>{
  try{
    const result = await pool.query('SELECT * FROM tb_filmes');
    res.json(result.rows);
  }
  catch(err){
    console.error('Erro ao buscar filmes',err);
    res.status(500).json({error: 'Erro ao buscar filmes'});
  }
})

router.get('/categoria/:categoria',async(req,res)=>{
  const categoria = req.params.categoria;
  const {page} = req.query
  const offset = (page-1)*20
  try{
    let result;

   if (categoria == "Todos"){
      result = await pool.query('SELECT * FROM tb_filmes ORDER BY id_filme asc LIMIT 20 OFFSET $1',[offset]);
      //console.log("todos");
    }
    else{
      result = await pool.query('SELECT f.id_filme, f.titulo, f.ano_lancamento, f.sinopse, f.url_filme, f.thumb_url FROM tb_filmes f JOIN tb_filme_genero fg ON f.id_filme = fg.id_filme JOIN tb_genero g ON fg.id_genero = g.id_genero WHERE g.nm_genero = $1 LIMIT 20 OFFSET $2',[categoria,offset])
    }
    res.json(result.rows);
  }
  catch(err){
      console.error('Erro ao buscar categoria',err);
      res.status(500).json({error: "Erro ao buscar categoria"});
  }
})
router.get('/:id',async(req,res)=>{
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


module.exports = router