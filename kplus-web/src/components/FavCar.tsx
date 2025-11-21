import { useEffect, useState } from "react";

import axiosInstance from "../axiosConfig";
import Carrossel2 from "./Carossel2";

const FavCar = ({user}:{user: string}) => {
     const [loadingF,setLoadingF] = useState(true);
     const [fav,setFav] = useState(null);
     const token = localStorage.getItem('token');
     const loadUsers = () =>{
        axiosInstance.get(`/favoritos/${user}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setFav(response.data);
            if(response.data.length != 0){
            setLoadingF(false);
            }
        })
        .catch(error => {
            console.log("Erro ao carregar historico: ",error);
            setLoadingF(false);
        }
    )
     }
    useEffect(()=>{

       loadUsers();
    },[]);
    const handleDelete = (e: any) =>{
        console.log(e);
        const {id,tipo} = e
        console.log(id,tipo);
        axiosInstance.delete(`/favoritos/${user}`,{
            headers:{
                Authorization:`Bearer ${token}`
            },
            data:{
                id: id,
                tipo: tipo
            }
        })
        .then(response=>{
            console.log("Favorito Deletado",response);
            loadUsers();
        })
        .catch(error =>{
            console.log("Erro ao deletar favorito",error);
        })
       }
return( 
    <>  
    { 
    !loadingF && user && (
<>
    <p className="text-gray-200 font-semibold">Favoritos</p>

<Carrossel2  obj = {fav} isFav={true} onDelete={handleDelete}/>
</>  
    )

    }
      </>  
)
}
export default FavCar