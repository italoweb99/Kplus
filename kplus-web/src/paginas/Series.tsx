import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import GenSelecter from '../components/GenSelecter';
interface Serie{
  id_serie:number;
  titulo: string;
  thumb_url: string;
}
const Series = () => {
  const [categoria,setCategoria] = useState('Todos');
  const [series,setSeries] = useState<Serie[]>([]);
  useEffect(()=>{
axiosInstance.get(`/series/categoria/${categoria}`)
.then(response => {
  setSeries(response.data);
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
   <GenSelecter Out={handleCat}/>
    </div>
    <div>
    <div className='grid grid-cols-6 gap-4 m-2'>
      {series.map((serie)=>(
          <div className="flex flex-col items-center justify-center" key={serie.id_serie}>
            <Link to = {`/series/${serie.id_serie}`}>
          <img src={`http://localhost:5000${serie.thumb_url}`} alt = 'out-image' className="h-56 rounded-lg"/>
          </Link>
          <h1 className='m-2 line-clamp-1'>{serie.titulo}</h1>
          </div>  
      ))}
      </div>
    </div>
  </div>
  );
};

export default Series;
