const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async(req,res)=>{
   // const generos = ['Ação','Aventura']
    //const pk = ['Dinossauro']
    const {generos, pk} = req.body
    try{
        const result = await pool.query(`SELECT 'Filme' as tipo, f.id_filme,f.titulo, COUNT(distinct pk.termo) AS gMatch ,COUNT( distinct g.nm_genero) AS pMatch,
COUNT(distinct pk.termo) + COUNT(distinct g.nm_genero) AS tMatch, thumb_url
FROM tb_filmes f
LEFT JOIN tb_palavras_filme fp ON fp.id_filme = f.id_filme
LEFT JOIN tb_palavras_chave pk ON pk.id_palavra = fp.id_palavra AND pk.termo = ANY($1) 
LEFT JOIN tb_filme_genero fg ON fg.id_filme = f.id_filme
LEFT JOIN tb_genero g ON fg.id_genero = g.id_genero AND g.nm_genero = ANY($2)
GROUP BY f.id_filme
HAVING COUNT(Distinct pk.termo) >0 OR COUNT(distinct g.nm_genero) > 0
ORDER BY tMatch desc
`,[pk,generos])
const filmes = result.rows.map(row => {
    const filme = {
        id: row.id_filme,
        titulo: row.titulo,
        tipo: row.tipo,
        thumb_url: row.thumb_url
    }
    return filme
}
)
console.log(filmes)
//console.log(result.rows)
res.status(200).json(filmes)
    }
    catch(err){
        console.log(err)
        res.json(500).json({message: 'Erro ao filtrar filmes'})
    }
})


module.exports = router