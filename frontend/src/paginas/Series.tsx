import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import GenSelecter from '../components/GenSelecter';
import InfiniteScroll from '../components/InfiniteScroll';

interface Serie {
  id_serie: number;
  titulo: string;
  thumb_url: string;
}

const Series = () => {
  const [categoria, setCategoria] = useState('Todos');
  const [hasMore, setHasMore] = useState(true);

  const fetchSeries = async (page: number): Promise<Serie[]> => {
    const res = await axiosInstance.get(`/series/categoria/${categoria}?page=${page}`);
    if (res.data.length < 20) setHasMore(false);
    else setHasMore(true);
    return res.data;
  };

  const handleCat = (cat: string) => {
    setCategoria(cat);
    setHasMore(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Séries</h1>
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
              fetchData={fetchSeries}
              hasMore={hasMore}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              renderItem={(serie: Serie, idx: number) => (
                <div
                  className="flex flex-col items-center transform hover:scale-105 transition"
                  key={`serie-${serie.id_serie}-${idx}`}
                >
                  <Link to={`/series/${serie.id_serie}`} className="w-full block rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`https://kplus-api.onrender.com${serie.thumb_url}`}
                      alt={serie.titulo}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <h2 className="mt-2 text-center text-sm text-white/90 line-clamp-1 w-full">{serie.titulo}</h2>
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Series;
