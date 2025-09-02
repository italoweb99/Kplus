import { useEffect, useState } from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
interface Filme{
  id_filme: number;
  titulo: string;
  thumb_url: string;
}
const Filmes = () => {
  const [categoria,setCategoria] = useState('Todos');
  const [filmes,setFilmes] = useState<Filme[]>([]);
  const btnStyle = "bg-blue-300 p-2 m-2 text-white text-md rounded-md";
  useEffect(()=>{
axiosInstance.get(`/filmes/categoria/${categoria}`)
.then(response => {
  setFilmes(response.data);
})
.catch(error =>{
  console.log('Erro ao buscar categorias: ',error);
})
  },[categoria]);
  const handleCat = (cat: string) =>{
    setCategoria(cat)
  }
  return (
   
  <div>
   
    <div>
    <button className={btnStyle}onClick={()=>handleCat('Todos')}>Todos</button>
    <button className={btnStyle} onClick={()=>handleCat('Comedia')}>Comedia</button>
    <button className={btnStyle} onClick={()=>handleCat('Animação')}>Animação</button>
    <button className={btnStyle} onClick={()=>handleCat('Drama')}>Drama</button>
    <button className={btnStyle} onClick={()=>handleCat('Ação')}>Ação</button>
    <button className={btnStyle} onClick={()=>handleCat('Aventura')}>Aventura</button>
    <button className={btnStyle} onClick={()=>handleCat('Ficção Científica')}>Ficção Científica</button>
    <button className={btnStyle} onClick={()=>handleCat('Romance')}>Romance</button>
    <button className={btnStyle} onClick={()=>handleCat('Fantasia')}>Fantasia</button>
    </div>
    <div>
    <div className='grid grid-cols-6 gap-4 m-2'>
      {filmes.map((filme)=>(
          <div className="flex flex-col items-center justify-center" key={filme.id_filme}>
            <Link to = {`/filmes/${filme.id_filme}`}>
          <img src={filme.thumb_url} className="h-56 rounded-lg"/>
          </Link>
          <h1 className='m-2 line-clamp-1'>{filme.titulo}</h1>
          </div>  
      ))}
      </div>
    </div>
  </div>
  );
};

export default Filmes;
