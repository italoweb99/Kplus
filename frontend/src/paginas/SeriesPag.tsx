import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectTemp from "../components/SelectTemp";
import axiosInstance from "../axiosConfig";
import { FaHeart, FaRegHeart, FaArrowLeft} from "react-icons/fa";

interface Series {
  titulo: string;
  totaltemp: number;
  genero: string[];
  sinopse: string;
  temps: number[];
  thumb_url?: string;
}

const SeriesPag = () => {
  const [serie, setSerie] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const isLogedin = !!token && !!user;

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/series/${id}`)
      .then((res) => setSerie(res.data))
      .catch((err) => console.error("Erro ao buscar série:", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (token && user) {
      axiosInstance
        .get(`/favoritos/${user}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const isFav =
            Array.isArray(res.data) &&
            res.data.some((f: any) => String(f.id_serie) === String(id));
          setIsFavorito(isFav);
        })
        .catch(() => setIsFavorito(false));
    } else {
      setIsFavorito(false);
    }
  }, [id, token, user]);

  const addFav = async () => {
    if (!token) return nav("/login");
    try {
      setFavLoading(true);
      await axiosInstance.post(
        `/favoritos/${user}/serie/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorito(true);
    } catch (err) {
      console.error("Erro ao adicionar favorito", err);
    } finally {
      setFavLoading(false);
    }
  };

  const removeFav = async () => {
    if (!token) return nav("/login");
    try {
      setFavLoading(true);
      await axiosInstance.delete(`/favoritos/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: id, tipo: "Serie" },
      });
      setIsFavorito(false);
    } catch (err) {
      console.error("Erro ao remover favorito", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
        <div className="text-slate-300">Carregando série...</div>
      </div>
    );
  }

  if (!serie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
        <div className="text-slate-300">Série não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-10 shadow-lg border border-white/5">
        <button
          onClick={() => nav(-1)}
          className="mb-4 inline-flex items-center gap-2 text-slate-200 hover:text-white"
        >
          <FaArrowLeft /> Voltar
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 w-full lg:w-1/3">
            <div className="rounded-xl overflow-hidden shadow-lg bg-slate-800">
              <img
                src={`https://kplus-api.onrender.com${
                  serie.thumb_url ?? "/thumbs/default.jpg"
                }`}
                alt={serie.titulo}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex-1 text-slate-100">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {serie.titulo}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                {serie.totaltemp ?? 0}{" "}
                {serie.totaltemp === 1 ? "temporada" : "temporadas"}
              </span>
              {Array.isArray(serie.genero) &&
                serie.genero.slice(0, 5).map((g, i) => (
                  <span
                    key={i}
                    className="text-sm bg-white/5 px-3 py-1 rounded-full text-slate-200"
                  >
                    {g}
                  </span>
                ))}
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">
              {serie.sinopse}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
            
              <button
                onClick={isFavorito ? removeFav : addFav}
                disabled={favLoading}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-md border ${
                  isFavorito
                    ? "bg-white/10 text-red-400 border-red-400 hover:bg-white/20"
                    : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
                }`}
              >
                {isFavorito ? <FaHeart /> : <FaRegHeart />}
                <span>
                  {isFavorito
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"}
                </span>
              </button>
            </div>

           
          </div>
          
        </div>
         <div className="bg-white/3 text-white p-4 rounded-lg border border-white/5">
              <h3 className="text-lg font-medium text-slate-100 mb-3">
                Temporadas
              </h3>
              <SelectTemp user={user} nTemp={serie.temps} isLogedin={isLogedin} />
            </div>
      </div>
    </div>
  );
};

export default SeriesPag;