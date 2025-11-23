import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { FaEye, FaSpinner } from "react-icons/fa";

const Cadastro = () => {
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enviar = async (e: any) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/cadastro", formData);
      setMessage(response.data.message || "Cadastro realizado com sucesso.");
      setTimeout(() => nav("/login"), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Erro ao cadastrar usuário.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xl backdrop-blur p-6">
        <h2 className="text-2xl font-semibold text-center text-slate-800 dark:text-slate-100 mb-2">
          Criar conta
        </h2>
        <p className="text-sm text-center text-slate-600 dark:text-slate-300 mb-6">
          Preencha seus dados para criar uma conta
        </p>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@exemplo.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Senha
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pr-10 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-[45px] transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Mostrar senha"
            >
              <FaEye />
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}
          {message && (
            <div className="text-sm text-green-700 dark:text-green-400">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white ${
              loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : null}
            Criar conta
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          <span>Já tem conta? </span>
          <button
            onClick={() => nav("/login")}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;