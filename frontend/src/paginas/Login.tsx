import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { FaEye, FaSpinner } from "react-icons/fa";

const Login = () =>{
    const [formData,setFormData] = useState({email:'',senha:''});
    const [type,setType] = useState<'password'|'text'>('password');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);
    const nav = useNavigate();

    const handleChange = (e: any) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const enviar = async (e: any) =>{
        e.preventDefault();
        setError(null);
        setLoading(true);
        try{
            const response = await axiosInstance.post('/login',formData);
            localStorage.setItem('idConta',response.data.user.id_conta);
            localStorage.setItem('token', response.data.user.token);
            localStorage.setItem('user', response.data.user.id_user || '');
            window.dispatchEvent(new Event('userChanged'));
            nav('/usuarios');
        }catch(err: any){
            const msg = err?.response?.data?.error || 'Erro ao realizar login';
            setError(msg);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
            <div className="w-full max-w-md mx-4 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xl backdrop-blur p-6">
                <h2 className="text-2xl font-semibold text-center text-slate-800 dark:text-slate-100 mb-4">Entrar</h2>
                <p className="text-sm text-center text-slate-600 dark:text-slate-300 mb-4">Acesse sua conta para continuar</p>

                <form onSubmit={enviar} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="seu@exemplo.com"
                            aria-label="Email"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Senha</label>
                        <input
                            type={type}
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                            className="w-full pr-10 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            aria-label="Senha"
                        />
                        <button
                            type="button"
                            onClick={() => setType(prev => prev === 'password' ? 'text' : 'password')}
                            className="absolute right-2 top-11 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                            aria-label="Mostrar senha"
                        >
                            <FaEye />
                        </button>
                    </div>

                    {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : null}
                        Entrar
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    <span>Não tem conta? </span>
                    <button
                        onClick={()=>nav('/cadastro')}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        Criar conta
                    </button>
                </div>
            </div>
        </div>
    )

}
export default Login