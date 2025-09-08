require('dotenv').config()
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Chave segura

// Função que se comunica com o Gemini (o mesmo código que você já tem)
async function obterFiltrosDeMidia(descricao) {
  // ... seu código da função aqui ...
  // Incluindo a lógica para a flag de tipo_midia
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });



  const prompt = `
    Dada a seguinte descrição de um filme ou série: "${descricao}"
    Retorne um objeto JSON contendo as chaves 'generos', 'palavras_chave' que seriam ideais para encontrar um filme com essa descrição e 'tipo_midia'. 
    O valor de 'tipo_midia' deve ser "filme" ou "serie" dependendo da descrição.
    Use palavras no plural e minúsculas.

    Exemplo de formato JSON de saída:
    {
      "generos": ["gênero1", "gênero2"],
      "palavras_chave": ["palavra1", "palavra2", "palavra3"],
      "tipo_midia": "filme"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const texto = response.text();
  
  try {
    const stringJsonValida = texto.substring(texto.indexOf('{'),texto.lastIndexOf('}')+1);
    const filtros = JSON.parse(stringJsonValida);
    return filtros;
  } catch (error) {
    console.error("Erro ao analisar a resposta JSON:", error);
    return null;
  }
}

// Criando o endpoint para o front-end


router.post('/', async(req,res)=>{
   // const generos = ['Ação','Aventura']
    //const pk = ['Dinossauro']
    const {descricao} = req.body
    if(!descricao){
        res.status(400).json({message: "A descrição é obrigatoria"})
    }
    try{
        filtros = await obterFiltrosDeMidia(descricao)
        //console.log(filtros)
        const{generos,palavras_chave} = filtros
        console.log(`Genero: ${generos} \nPalvras Chave: ${palavras_chave}`)
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
LIMIT 5
`,[palavras_chave,generos])
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