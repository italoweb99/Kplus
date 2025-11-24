import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "../components/InfiniteScroll";
import axiosInstance from "../axiosConfig";
import { useState } from "react";

interface Item {
  tipo: "filme" | "serie" | string;
  titulo: string;
  sinopse?: string;
  id: number;
  thumb_url: string;
}

// página de busca estilizada
const SearchPage = () => {
  const { query } = useParams<{ query?: string }>();
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (page: number): Promise<Item[]> => {
    const res = await axiosInstance.get(`/search`, {
      params: {
        query: query ?? "",
        page: page,
      },
    });

    const filmes = Array.isArray(res.data?.filmes) ? res.data.filmes : [];
    const series = Array.isArray(res.data?.series) ? res.data.series : [];
    const items: Item[] = [...filmes, ...series];

    // se vier menos que o page size (20), acabar a lista
    if (items.length < 20) setHasMore(false);
    else setHasMore(true);

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">
            Resultados
            {query ? (
              <span className="text-slate-300 font-normal ml-2">para “{query}”</span>
            ) : (
              <span className="text-slate-300 font-normal ml-2">- Pesquisar</span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Encontre filmes e séries</p>
        </header>

        <main>
          <div className="bg-white/3 p-4 rounded-lg border border-white/6 shadow-sm">
            <InfiniteScroll
              key={query}
              fetchData={fetchItems}
              hasMore={hasMore}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              renderItem={(item: Item, index: number) =>
                item.tipo === "filme" ? (
                  <div
                    className="flex flex-col items-start transform hover:scale-105 transition"
                    key={`filme-${item.id}-${index}`}
                  >
                    <Link to={`/filmes/${item.id}`} className="w-full block rounded-lg overflow-hidden shadow-md">
                      <img
                        src={`https://kplus-api.onrender.com${item.thumb_url}`}
                        alt={item.titulo}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <h2 className="mt-2 text-sm text-white/90 line-clamp-1 w-full">{item.titulo}</h2>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-start transform hover:scale-105 transition"
                    key={`serie-${item.id}-${index}`}
                  >
                    <Link to={`/series/${item.id}`} className="w-full block rounded-lg overflow-hidden shadow-md">
                      <img
                        src={`https://kplus-api.onrender.com${item.thumb_url}`}
                        alt={item.titulo}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <h2 className="mt-2 text-sm text-white/90 line-clamp-1 w-full">{item.titulo}</h2>
                  </div>
                )
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;