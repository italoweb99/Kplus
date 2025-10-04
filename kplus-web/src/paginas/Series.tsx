import {useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import GenSelecter from '../components/GenSelecter';
import InfiniteScroll from '../components/InfiniteScroll';
interface Serie{
  id_serie:number;
  titulo: string;
  thumb_url: string;
}
const Series = () => {
 const [categoria, setCategoria] = useState('Todos');
  const [hasMore, setHasMore] = useState(true);

  // Função para buscar filmes paginados
  const fetchFilmes = async (page: number): Promise<Serie[]> => {
    const res = await axiosInstance.get(`/series/categoria/${categoria}?page=${page}`);
    // Se vier menos do que o esperado, acabou a lista
    //console.log(res.data)
    if (res.data.length < 20) setHasMore(false);
    else setHasMore(true);
    return res.data;
  };

  const handleCat = (cat: string) => {
    setCategoria(cat);
    setHasMore(true); // resetar scroll infinito ao trocar categoria
  };

  return (
   
 
   
    <div>
   <GenSelecter Out={handleCat}/>
     <InfiniteScroll
      key={categoria}
        fetchData={fetchFilmes}
        hasMore={hasMore}
        renderItem={(serie: Serie, idx: number) => (
          <div className="flex flex-col items-center justify-center" key={`filme-${serie.id_serie}-${idx}`}>
            <Link to={`/series/${serie.id_serie}`}>
              <img src={`http://localhost:5000${serie.thumb_url}`} className="h-56 rounded-lg" />
            </Link>
            <h1 className='m-2 line-clamp-1'>{serie.titulo}</h1>
          </div>
        )}
        className="grid grid-cols-6 gap-4 m-2"
      />
  </div>
  );
};

export default Series;
