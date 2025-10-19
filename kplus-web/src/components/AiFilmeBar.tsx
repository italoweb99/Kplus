import { useState } from "react";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "./Carossel2";
import { MdSend } from "react-icons/md"; // Importando o ícone de enviar
import { FaTimes } from "react-icons/fa";
//TODO: estilizar a tela
interface filmeData {
  id: Number;
  titulo: String;
}

const AiFilmeBar = () => {
  const [filmes, setFilmes] = useState<filmeData[]>([]);
  const [descricao, setDescricao] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura da barra de pesquisa
  const [isLoading, setIsLoading] = useState(false); // Estado para o indicador de carregamento
  const [showResults, setShowResults] = useState(false); // Estado para mostrar a caixa de resultados

  const handleSubmit = async () => {
    if (descricao) {
      setIsLoading(true); // Inicia o carregamento
      setShowResults(false); // Esconde resultados anteriores
      try {
        const response = await axiosInstance.post("/gia", {
          descricao: descricao,
        });
        setFilmes(response.data);
        setShowResults(true);
         // Exibe a caixa de resultados
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
        // Opcional: mostrar uma mensagem de erro para o usuário
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Botão Flutuante Redondo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </button>

      {/* Barra de Pesquisa e Resultados */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className=" fixed bottom-16 w-4/6  flex flex-col justify-end items-center transform transition-all duration-300 ease-in-out scale-100">
            {/* Cabeçalho da barra de pesquisa com botão de fechar */}
           <div className=" p-4 border max-w-4xl  min-w-2xl border-gray-200 rounded-lg bg-gray-50 max-h-5xl overflow-y-auto">
             {showResults && filmes.length > 0 && (
             
                <div className="p-4 max-w-4xl ">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                  Esses são os filmes mais próximos à sua descrição:
                </h3>
                <Carrossel2
                  obj={filmes}
                  width={50}
                  height={70}
                  titulos={true}
                />
                </div>
            )}

            {showResults && filmes.length === 0 && (
              <div className="mt-6 p-4 text-center text-gray-600">
                Nenhum filme encontrado para a sua descrição.
              </div>
            )}

            {isLoading && (
              <div className="mt-6 text-center text-blue-600">
                Buscando filmes...
              </div>
            )}
              
            
            </div>
            {/* Barra de Pesquisa */}
            <div className="flex w-full bg-white p-1 rounded-full items-center space-x-1 mt-4">
            <FaTimes className="mx-2"onClick={()=>{setIsOpen(false)}}/>
              <input
                type="text"
                placeholder="Descreva o tipo de filme que você procura..."
                className="flex-auto p-3 bg-white border border-none rounded-full focus:outline-none focus:ring-none focus:ring-blue-500"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading} // Desabilita o botão enquanto carrega
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <MdSend className="h-5 w-5" />
                )}
              </button>
            </div>

  
           
          </div>
        </div>
      )}
    </div>
  );
};

export default AiFilmeBar;