const express = require('express');
const pool = require('../db');
const router = express.Router();
const {authenticateToken} = require('../controllers/auth')
router.get('/temporadas/:temp/:user',authenticateToken,async(req,res)=>{
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
router.get('/categoria/:categoria',async(req,res)=>{
  const categoria = req.params.categoria;
  const {page} = req.query
  const offset = (page-1)*20
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
        WHERE g.nm_genero = $1
        LIMIT 20
        OFFSET $2`,[categoria,offset])
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

router.get('/temporadas/:temp', async(req,res)=>{
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
router.get('/proximoEp/:id',authenticateToken,async(req,res)=>{
  const {id} = req.params
  try{
  result = await pool.query(`SELECT
  -- Tenta encontrar o próximo episódio na mesma temporada
  CASE
    WHEN (
      SELECT
        COUNT(*)
      FROM tb_episodios AS E2
      WHERE E2.id_temp = E1.id_temp AND E2.nm_ep > E1.nm_ep
    ) > 0 THEN (
      SELECT
        E2.id_ep
      FROM tb_episodios AS E2
      WHERE E2.id_temp = E1.id_temp AND E2.nm_ep > E1.nm_ep
      ORDER BY
        E2.nm_ep
      LIMIT 1
    )
    -- Se não houver, encontra o primeiro episódio da próxima temporada
    ELSE (
      SELECT
        E3.id_ep
      FROM tb_episodios AS E3
      JOIN tb_temporadas AS T3
        ON E3.id_temp = T3.id_temp
      JOIN tb_temporadas AS T4
        ON T3.id_serie = T4.id_serie
      WHERE
        T4.id_temp = E1.id_temp AND T3.nm_temp > T4.nm_temp
      ORDER BY
        T3.nm_temp,
        E3.nm_ep
      LIMIT 1
    )
  END AS proximo_episodio
FROM tb_episodios AS E1
WHERE
  E1.id_ep = $1;`,[id])
  res.status(200).json(result.rows[0])
  }
  catch(err){
    console.log(err)
    res.status(500).json({message: "erro ao obter proximo episodio"})
  }
})
module.exports = router