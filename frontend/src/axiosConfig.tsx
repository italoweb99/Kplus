import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://kplus-api.onrender.com',
});

// Interceptar respostas para verificar token inválido
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Redirecionar para a página de login
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     localStorage.removeItem('idConta');
    }
    return Promise.reject(error);
  }
 
);
axiosInstance.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
    })

export default axiosInstance;
