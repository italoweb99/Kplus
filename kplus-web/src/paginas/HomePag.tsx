//import { Link } from "react-router-dom"
//import Carosel from "../components/Carosel";
//import CaroselExtended from "../components/CaroselExtended";
import { useEffect, useState } from "react";
import HistoricoCar from "../components/HistoricoCar";
import FavCar from "../components/FavCar";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "../components/Carossel2";
import Carrossel from "../components/Carrossel";

const HomePag = () => {
  const [loadingD, setLoadingD] = useState(true);
  const [destaques, setDestaque] = useState<any>(null);

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const isLogedin = !!token && !!user;

  useEffect(() => {
    let mounted = true;
    setLoadingD(true);
    axiosInstance
      .get("/destaques")
      .then((response) => {
        if (!mounted) return;
        setDestaque(response.data);
      })
      .catch((error) => {
        console.log("Erro ao carregar destaques: ", error);
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingD(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white">
      {/* Full width carousel */}
      <div className="w-full">
        <div className="w-full">
          <Carrossel />
        </div>
      </div>

      {/* Centralized content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="space-y-8">
          {isLogedin && (
            <div className="bg-white/3 p-4 rounded-lg border border-white/6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Continuar assistindo</h2>
                <span className="text-sm text-slate-300">Do seu histórico</span>
              </div>
              <HistoricoCar user={user} />
            </div>
          )}

          <div className="bg-white/3 p-4 rounded-lg border border-white/6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Destaques</h2>
              <span className="text-sm text-slate-300">Selecionados para você</span>
            </div>

            {loadingD ? (
              <div className="space-y-3">
                <div className="h-48 rounded-lg bg-white/6 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-36 rounded-md bg-white/6 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <Carrossel2 obj={destaques} />
            )}
          </div>

          {isLogedin && (
            <div className="bg-white/3 p-4 rounded-lg border border-white/6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Seus favoritos</h2>
                <span className="text-sm text-slate-300">Acesse rápido</span>
              </div>
              <FavCar user={user} />
            </div>
          )}

          {!isLogedin && (
            <div className="mt-4 p-6 rounded-lg bg-white/3 border border-white/6 text-center">
              <p className="mb-4 text-slate-200">
                Entre para salvar seus favoritos e continuar assistindo.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/login"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Entrar
                </a>
                <a
                  href="/cadastro"
                  className="px-5 py-2 bg-transparent border border-white/10 rounded-md text-white/90 hover:bg-white/5"
                >
                  Criar conta
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePag;