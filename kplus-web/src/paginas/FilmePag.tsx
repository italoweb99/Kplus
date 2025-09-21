import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"
import axiosInstance from "../axiosConfig";
interface Data{
    titulo: string;
    thumb_url: string;
    ano_lancamento: number;
    genero: string[];
    sinopse: string;

}
const FilmePag = () =>{
    const params = useParams();
    const nav = useNavigate();
    const id = params.id;
    const[data,setData] = useState<Data>();
    const[loading,setLoading] = useState(true);
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const [isFavorito, setIsFavorito] = useState(false);

    useEffect(()=>{
       
    axiosInstance.get(`/filmes/${id}`)
    .then(response => {
        setData(response.data);
        setLoading(false);
    })
    .catch(error =>{
        console.log('Erro ao buscar categorias: ',error);
        setLoading(false);
      })
    },[id])

    // Verifica se está nos favoritos ao carregar
useEffect(() => {
      if (token && user) {
        axiosInstance.get(`/favoritos/${user}/all`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
          .then(res => {
            const isFav = res.data.some((fav: any)=> String(fav.id_filme) === String(id))
           setIsFavorito(isFav)
          })
          .catch(() => setIsFavorito(false));
      }
    }, [id, token, user]);


   const addFav = () =>{
    if(token){
       axiosInstance.post(`/favoritos/${user}/filmes/${id}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
       .then(() => setIsFavorito(true))
       .catch(error => console.log(error.response.data.error))
    }
    else{
       nav('/login')
    }
   }

   const removeFav = () => {
   
    if (token) {
      axiosInstance.delete(`/favoritos/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
        data:{
            id: id,
            tipo: 'Filme'
        }
      })
      .then(() => setIsFavorito(false))
      .catch(error => console.log(error.response.data.error));
    }
  };

if(loading){
    return(
        <p>Carregando... </p>
    )
}
else{
return(
    <div className="h-screen">
    <img src={`http://localhost:5000${data?.thumb_url}`}/>
    <div className="flex justify-start items-center space-x-2">
         <button onClick={()=>nav(`/reproducao/filme/${id}`) } className="bg-blue-500">Assistir</button>
         <button
  onClick={isFavorito ? removeFav : addFav}
  className="bg-blue-500"
>
  {isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
</button>
    </div>
    <h1>{data?.titulo}</h1>
    <p>{data?.ano_lancamento}</p>
   <p>{data?.genero.join(", ")}</p>
    <p>{data?.sinopse}</p>
    </div>
);
}
}
export default FilmePag