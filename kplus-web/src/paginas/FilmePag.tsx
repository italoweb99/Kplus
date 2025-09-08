
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
    //console.log(data.genero);
   const addFav = () =>{
    if(token){
       axiosInstance.post(`/favoritos/${user}/filmes/${id}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
       .catch(error => console.log(error.response.data.error))
    }
    else{
       nav('/login')
    }
   }
if(loading){
    return(
        <p>Carregando... </p>
    )
}
else{
return(
    <div className="h-screen">
     <button onClick = {()=>addFav()}className="bg-blue-500">adicionar aos favoritos</button>
    <img src={`http://localhost:5000${data?.thumb_url}`}/>
    <h1>{data?.titulo}</h1>
    <p>{data?.ano_lancamento}</p>
   <p>{data?.genero.join(", ")}</p>
    <p>{data?.sinopse}</p>
    </div>
);
}
}
export default FilmePag