import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

interface Thumb {
  id_user_thumb: number;
  url: string;
  descricao?: string;
}

interface Props {
  // ao selecionar retorna { id: number, url: string }
  onClose: (selection: { id: number; url: string }) => void;
}

const SelectUserThumb = ({ onClose }: Props) => {
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/userthumbs", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = (res.data || []).map((t: any) => ({
          id_user_thumb: t.id_user_thumb ?? t.id,
          url: t.thumb_url ?? t.url ?? t.thumb,
          descricao: t.descricao ?? t.nome ?? "",
        }));
        setThumbs(data);
      } catch (err) {
        console.error("Erro ao carregar thumbnails", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const choose = (t: Thumb) => {
    setSelectedId(t.id_user_thumb);
    onClose({ id: t.id_user_thumb, url: t.url });
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">Escolha um ícone para o perfil</p>
      </div>

      <div className="max-h-64 overflow-auto px-2 space-x-4">
        {loading ? (
          <div className="py-8 text-center text-slate-500">Carregando ícones...</div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {thumbs.map((t) => (
              <button
                key={t.id_user_thumb}
                onClick={() => choose(t)}
                className={`flex flex-col items-center justify-center p-1 rounded-md transition transform hover:scale-105 focus:outline-none ${
                  selectedId === t.id_user_thumb ? "ring-2 ring-blue-500" : "ring-0"
                }`}
                aria-pressed={selectedId === t.id_user_thumb}
                title={t.descricao || `Ícone ${t.id_user_thumb}`}
              >
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img
                    src={`https://kplus-api.onrender.com${t.url}`}
                    alt={t.descricao || `icone-${t.id_user_thumb}`}
                    className="h-full  w-full object-cover"
                  />
                </div>
             
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectUserThumb;