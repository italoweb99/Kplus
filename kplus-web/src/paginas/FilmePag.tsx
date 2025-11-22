import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { FaPlay, FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";

interface Data {
  titulo: string;
  thumb_url: string;
  ano_lancamento: number;
  genero: string[];
  sinopse: string;
}

const FilmePag = () => {
  const params = useParams();
  const nav = useNavigate();
  const id = params.id;
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const [isFavorito, setIsFavorito] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/filmes/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Erro ao buscar filme: ", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (token && user) {
      axiosInstance
        .get(`/favoritos/${user}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const isFav = res.data.some(
            (fav: any) => String(fav.id_filme) === String(id)
          );
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
        `/favoritos/${user}/filmes/${id}`,
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
        data: { id: id, tipo: "Filme" },
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
        <div className="text-slate-300">Carregando filme...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
        <div className="text-slate-300">Filme não encontrado.</div>
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
          {/* Poster */}
          <div className="flex-shrink-0 w-full lg:w-1/3">
            <div className="rounded-xl overflow-hidden shadow-lg bg-slate-800">
              <img
                src={`http://localhost:5000${data.thumb_url}`}
                alt={data.titulo}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-slate-100">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {data.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                {data.ano_lancamento}
              </span>
              {Array.isArray(data.genero) &&
                data.genero.slice(0, 5).map((g, i) => (
                  <span
                    key={i}
                    className="text-sm bg-white/5 px-3 py-1 rounded-full text-slate-200"
                  >
                    {g}
                  </span>
                ))}
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">
              {data.sinopse}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  token ? nav(`/reproducao/filme/${id}`) : nav("/login")
                }
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md shadow"
              >
                <FaPlay /> Assistir
              </button>

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
      </div>
    </div>
  );
};

export default FilmePag;