import { useEffect, useState } from "react";
import ThumbFrame from "./ThumbFrame";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

interface SelectTempProps {
  nTemp: number[] | undefined;
  user: string | null;
  isLogedin: boolean;
}
interface Episodios {
  titulo: string;
  id_ep: number;
  sinopse: string;
  thumb_url: string;
  tempo_assist: number;
  duracao: number;
}

const SelectTemp = ({ nTemp, user, isLogedin }: SelectTempProps) => {
  const [temporada, setTemporada] = useState<string>(String(nTemp?.[0] ?? "1"));
  const [eps, setEps] = useState<Episodios[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");

  // atualiza temporada inicial quando nTemp muda
  useEffect(() => {
    if (nTemp && nTemp.length) setTemporada(String(nTemp[0]));
  }, [nTemp]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchUrl = user != null
      ? `/series/temporadas/${temporada}/${user}`
      : `/series/temporadas/${temporada}`;

    axiosInstance
      .get(fetchUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then((response) => {
        if (!mounted) return;
        setEps(response.data || []);
      })
      .catch((error) => {
        console.log("Erro ao carregar episodios", error);
        if (mounted) setEps([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [temporada, user, token]);

  const toMins = (time: number) => Math.floor(time / 60);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
    
        <select
          value={temporada}
          onChange={(e) => setTemporada(e.target.value)}
          className="ml-2 px-3 py-2 rounded-md bg-white/5 text-white border border-white/6 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          {nTemp?.map((temp, index) => (
            <option key={index} value={temp} className=" bg-slate-600 hover:bg-slate-700">
              {`Temporada ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* lista vertical de episodios */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-white/3 rounded-lg border border-white/6 animate-pulse">
              <div className="h-20 w-36 rounded-lg bg-white/6" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/5 rounded bg-white/6" />
                <div className="h-3 w-4/5 rounded bg-white/6" />
                <div className="h-3 w-1/5 rounded bg-white/6" />
              </div>
            </div>
          ))
        ) : eps.length === 0 ? (
          <div className="text-sm text-slate-400">Nenhum episódio encontrado.</div>
        ) : (
          eps.map((ep) => (
            <div
              key={ep.id_ep}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-white/3 rounded-lg border border-white/6"
            >
              <div className="flex-shrink-0">
                {isLogedin ? (
                  <Link to={`/reproducao/serie/${ep.id_ep}`} className="block">
                    <ThumbFrame src={`http://localhost:5000${ep.thumb_url}`} tempo_assist={ep.tempo_assist} duracao={ep.duracao} />
                  </Link>
                ) : (
                  <Link to="/login" className="block">
                    <ThumbFrame src={`http://localhost:5000${ep.thumb_url}`} tempo_assist={ep.tempo_assist} duracao={ep.duracao} />
                  </Link>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{ep.titulo}</h3>
                  <span className="text-sm text-slate-300">{`${toMins(ep.duracao)} min`}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300 line-clamp-3">{ep.sinopse}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectTemp;