import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import GenSelecter from '../components/GenSelecter';
import InfiniteScroll from '../components/InfiniteScroll';

interface Filme {
  id_filme: number;
  titulo: string;
  thumb_url: string;
}

const Filmes = () => {
  const [categoria, setCategoria] = useState('Todos');
  const [hasMore, setHasMore] = useState(true);

  // Função para buscar filmes paginados
  const fetchFilmes = async (page: number): Promise<Filme[]> => {
    const res = await axiosInstance.get(`/filmes/categoria/${categoria}?page=${page}`);
    // Se vier menos do que o esperado, acabou a lista
    console.log(res.data)
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
      <GenSelecter Out={handleCat} />
      <InfiniteScroll
      key={categoria}
        fetchData={fetchFilmes}
        hasMore={hasMore}
        renderItem={(filme: Filme, idx: number) => (
          <div className="flex flex-col items-center justify-center" key={`filme-${filme.id_filme}-${idx}`}>
            <Link to={`/filmes/${filme.id_filme}`}>
              <img src={`http://localhost:5000${filme.thumb_url}`} className="h-56 rounded-lg" />
            </Link>
            <h1 className='m-2 line-clamp-1'>{filme.titulo}</h1>
          </div>
        )}
        className="grid grid-cols-6 gap-4 m-2"
      />
    </div>
  );
};

export default Filmes;
