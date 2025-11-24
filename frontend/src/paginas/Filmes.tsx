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
    if (res.data.length < 20) setHasMore(false);
    else setHasMore(true);
    return res.data;
  };

  const handleCat = (cat: string) => {
    setCategoria(cat);
    setHasMore(true); // resetar scroll infinito ao trocar categoria
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Filmes</h1>
            <p className="text-sm text-slate-300 mt-1">Explore por categoria</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <GenSelecter Out={handleCat} />
          </div>
        </header>

        <main>
          <div className="bg-white/3 p-4 rounded-lg border border-white/6 shadow-sm">
            <InfiniteScroll
              key={categoria}
              fetchData={fetchFilmes}
              hasMore={hasMore}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              renderItem={(filme: Filme, idx: number) => (
                <div
                  className="flex flex-col items-center transform hover:scale-105 transition"
                  key={`filme-${filme.id_filme}-${idx}`}
                >
                  <Link to={`/filmes/${filme.id_filme}`} className="w-full block rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`https://kplus-api.onrender.com${filme.thumb_url}`}
                      alt={filme.titulo}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <h2 className="mt-2 text-center text-sm text-white/90 line-clamp-1 w-full">{filme.titulo}</h2>
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Filmes;
