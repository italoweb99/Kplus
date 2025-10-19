
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectTemp from "../components/SelectTemp";
import axiosInstance from "../axiosConfig";
interface Series{
    titulo: string;
    totaltemp: number;
    genero: string [];
    sinopse: string;
    temps: number[];
}
//TODO: estilizar pagina
const SeriesPag = () =>{
    const [serie,setSerie] = useState<Series>();
    const [loading,setLoading] = useState(true);
    const {id} = useParams();
    const nav = useNavigate();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const isLogedin = !!token && !!user;
    const [isFavorito, setIsFavorito] = useState(false)
    useEffect(()=>{
     axiosInstance.get(`/series/${id}`)
     .then(response => {
        setSerie(response.data);
        setLoading(false);
        //console.log(response.data);
     })
     .catch(error => {
       console.log("Erro ao buscar serie: ",error);
       setLoading(false);
     })
    
    },[id])
    useEffect(() => {
      if (token && user) {
        axiosInstance.get(`/favoritos/${user}/all`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
          .then(res => {
            const isFav = res.data.some((fav: any)=> String(fav.id_serie) === String(id))
           setIsFavorito(isFav)
          })
          .catch(() => setIsFavorito(false));
      }
    }, [id, token, user]);
   const addFav = () =>{
    if(token){
       axiosInstance.post(`/favoritos/${user}/serie/${id}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
       .then(()=>setIsFavorito(true))
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
            tipo: 'Serie'
        }
      })
      .then(() => setIsFavorito(false))
      .catch(error => console.log(error.response.data.error));
    }
  };
    if(loading){
        <p>Carregando</p>
    }
    else{
    return(
        <div>
         <button
  onClick={isFavorito ? removeFav : addFav}
  className="bg-blue-500"
>
  {isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
</button>
       <h1>{serie?.titulo}</h1> 
       <p>{`${serie?.totaltemp} ${serie?.totaltemp == 1 ? 'temporada': 'temporadas'}`}</p>
       <p>{serie?.genero.join(', ')}</p>
       <p>{serie?.sinopse}</p>
       <SelectTemp user = {user} nTemp={serie?.temps} isLogedin = {isLogedin}/>
       </div>
    );
}
}
export default SeriesPag