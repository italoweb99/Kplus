//import { Link } from "react-router-dom"
//import Carosel from "../components/Carosel";
//import CaroselExtended from "../components/CaroselExtended";
import { useEffect, useState } from "react";
import HistoricoCar from "../components/HistoricoCar";
import FavCar from "../components/FavCar";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "../components/Carossel2";
import Carrossel from "../components/Carrossel";
//TODO: estilizar pagina
const HomePag = () => {
   // const btnStyle = "bg-blue-300 p-2 m-2 text-white text-md rounded-md";
    
    const [loadingD,setLoadingD] = useState(true);
   
    const [destaques,setDestaque] = useState(null);

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const isLogedin = !!token && !!user;
    console.log(isLogedin);
   
   
    useEffect(()=>{
        axiosInstance.get('/destaques')
        .then(response => {
            setDestaque(response.data);
            setLoadingD(false);
        })
        .catch(error => {
            console.log("Erro ao carregar historico: ",error);
            setLoadingD(false);
        })
    },[]);
    
return(
    <div>
        
       
    <div className="mb-4">
    <Carrossel/>
    </div>
    <div>
       
    {isLogedin &&
     <HistoricoCar user = {user}/>
}
</div>
<div>
        <p>Destaques</p>
    {!loadingD &&
    <Carrossel2  obj = {destaques} />   
}
</div>
<div>
    {isLogedin &&
    (
      <FavCar user = {user} />
     )
}
</div>
    </div>
);
}
export default HomePag