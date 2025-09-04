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
    <button className={btnStyle} onClick={()=>handleCat('comédia')}>Comedia</button>
    <button className={btnStyle} onClick={()=>handleCat('animação')}>Animação</button>
    <button className={btnStyle} onClick={()=>handleCat('drama')}>Drama</button>
    <button className={btnStyle} onClick={()=>handleCat('ação')}>Ação</button>
    <button className={btnStyle} onClick={()=>handleCat('aventura')}>Aventura</button>
    <button className={btnStyle} onClick={()=>handleCat('ficção científica')}>Ficção Científica</button>
    <button className={btnStyle} onClick={()=>handleCat('romance')}>Romance</button>
    <button className={btnStyle} onClick={()=>handleCat('fantasia')}>Fantasia</button>
    <button className={btnStyle} onClick={()=>handleCat('suspense')}>Suspense</button>
    <button className={btnStyle} onClick={()=>handleCat('mistério')}>Mistério</button>
    <button className={btnStyle} onClick={()=>handleCat('crime')}>Crime</button>
    <button className={btnStyle} onClick={()=>handleCat('terror')}>Terror</button>
    <button className={btnStyle} onClick={()=>handleCat('biografia')}>Biografia</button>
    <button className={btnStyle} onClick={()=>handleCat('musical')}>Musical</button>
    </div>
    <div>
    <div className='grid grid-cols-6 gap-4 m-2'>
      {filmes.map((filme)=>(
          <div className="flex flex-col items-center justify-center" key={filme.id_filme}>
            <Link to = {`/filmes/${filme.id_filme}`}>
          <img src={`http://localhost:5000${filme.thumb_url}`} className="h-56 rounded-lg"/>
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
