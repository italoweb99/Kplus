import { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "./Carossel2";
import { MdSend } from "react-icons/md";
import { FaTimes } from "react-icons/fa";

interface FilmeData {
  id: number;
  titulo: string;
  thumb_url?: string;
}

const AiFilmeBar = () => {
  const location = useLocation();
  // Não renderiza sobre páginas de player/reproducao
  if (location.pathname.startsWith("/reproducao") || location.pathname.startsWith("/player")) return null;

  const [filmes, setFilmes] = useState<FilmeData[]>([]);
  const [descricao, setDescricao] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async () => {
    if (!descricao.trim()) return;
    setIsLoading(true);
    setShowResults(false);
    try {
      const response = await axiosInstance.post("/gia", { descricao: descricao.trim() });
      const data = (response.data || []).map((f: any) => ({
        id: f.id ?? f._id ?? 0,
        titulo: f.titulo ?? f.name ?? "",
        thumb_url: f.thumb_url ?? f.url ?? f.thumb ?? "/Users/iconeDefault_user.svg",
      }));
      setFilmes(data);
      setShowResults(true);
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
      setFilmes([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Floating button - visual alinhado ao tema */}
      <button
        onClick={() => setIsOpen((s) => !s)}
        aria-label="Abrir busca AI"
        title="Buscar filmes com AI"
        className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-[60] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl border border-white/10 hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div className="relative w-full max-w-4xl mx-4 md:mx-0 mb-6 md:mb-0">
            <div className="rounded-xl overflow-hidden bg-slate-900/95 border border-white/6 shadow-xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Buscar com AI</h3>
                  <p className="text-sm text-slate-400">Descreva o tipo de filme e eu trago sugestões</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white p-2 rounded-md"
                  aria-label="Fechar"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-blue-400">Buscando filmes...</div>
                  </div>
                )}

                {!isLoading && showResults && filmes.length > 0 && (
                  <div>
                    <h4 className="text-sm text-slate-300 mb-3 text-center">Resultado aproximado</h4>
                    <div className="px-2">
                      <Carrossel2 obj={filmes} width={44} height={60} titulos />
                    </div>
                  </div>
                )}

                {!isLoading && showResults && filmes.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    Nenhum filme encontrado para a descrição informada.
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-gradient-to-t from-slate-800/60 to-transparent border-t border-white/6">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                  <input
                    type="text"
                    placeholder="Descreva o tipo de filme que você procura..."
                    className="flex-1 px-4 py-3 rounded-full bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                    aria-label="Enviar descrição"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <MdSend className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiFilmeBar;