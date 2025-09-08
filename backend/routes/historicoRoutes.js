const express = require('express')
const pool = require('../db')
const { authenticateToken } = require('../controllers/auth')
const router = express.Router()

router.get('/:id_usuario',authenticateToken, async (req, res) => {
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

module.exports = router