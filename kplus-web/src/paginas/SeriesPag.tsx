
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SelectTemp from "../components/SelectTemp";
import axiosInstance from "../axiosConfig";
interface Series{
    titulo: string;
    totaltemp: number;
    genero: string [];
    sinopse: string;
    temps: number[];
}
const SeriesPag = () =>{
    const [serie,setSerie] = useState<Series>();
    const [loading,setLoading] = useState(true);
    const {id} = useParams();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const isLogedin = !!token && !!user;
    useEffect(()=>{
     axiosInstance.get(`/series/${id}`)
     .then(response => {
        setSerie(response.data);
        setLoading(false);
        console.log(response.data);
     })
     .catch(error => {
       console.log("Erro ao buscar serie: ",error);
       setLoading(false);
     })
    
    },[id])
   const addFav = () =>{
       axiosInstance.post(`/${user}/favoritos/serie/${id}`,{},{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
       .then(response => console.log(response.data.message))
       .catch(error => console.log(error.response.data.error))
   }
    if(loading){
        <p>Carregando</p>
    }
    else{
    return(
        <div>
        <button onClick = {()=>addFav()}className="bg-blue-500">adicionar aos favoritos</button>
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