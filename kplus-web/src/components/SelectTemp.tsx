
import { useEffect, useState } from "react";
//import TimeSlider from "./TimeSlider";
import ThumbFrame from "./ThumbFrame";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
interface SelectTempProps{
    nTemp: number[]|undefined;
    user: string|null;
    isLogedin: boolean;
}
interface Episodios{
    titulo: string;
    id_ep: number;
    sinopse: string;
    thumb_url: string;
    tempo_assist: number;
    duracao: number;

}
const SelectTemp = ({nTemp,user,isLogedin}:SelectTempProps) =>{
const [temporada,setTemporada] = useState('1');
const [eps, setEps] = useState<Episodios[]>([]);
const [loading,setLoading] = useState(true);
const token = localStorage.getItem('token');
//const [user,setUser] = useState('1');
//const isLogedin = !!token && !!user;
useEffect(()=>{
    if(user!= null)  {
        axiosInstance.get(`${user}/series/temporadas/${temporada}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
           setEps(response.data);
           console.log(user);
           setLoading(false);
        })
        .catch(error =>{
         console.log("Erro ao carregar episodios",error);
         setLoading(false);
        })
    }
    else{
   axiosInstance.get(`/series/temporadas/${temporada}`)
   .then(response => {
      setEps(response.data);
      setLoading(false);
   })
   .catch(error =>{
    console.log("Erro ao carregar episodios",error);
    setLoading(false);
   })
}
},[temporada])
//console.log(temporada);
//console.log(eps);
const toMins = (time: number) =>{
    return Math.floor(time/60)
}
return(
    <div>
    <select value={temporada} onChange={(e)=>setTemporada(e.target.value)}>
      {
        nTemp?.map((temp, index)=>(
            <option key={index} value={temp}>{`Temporada ${index+1}`}</option>
        ))
      }
    </select>
    {!loading &&(
    
    <div>
        {
            eps.map((ep)=>(
                <div key = {ep.id_ep}>
                    <p>{ep.titulo}</p>
                    <p>{ep.sinopse}</p>
                    <p>{`${toMins(ep.duracao)} mins`}</p>
                    {isLogedin ? (
                   <ThumbFrame src={`http://localhost:5000${ep.thumb_url}`}  tempo_assist={ep.tempo_assist} duracao={ep.duracao}/>
                    ):(
                        <Link to = '/login'>
                             <ThumbFrame src={`http://localhost:5000${ep.thumb_url}`}  tempo_assist={ep.tempo_assist} duracao={ep.duracao}/>
                        </Link>
                    )
                    }
                </div>
            ))
        }
   </div>
   )
}
    </div>
);
}
export default SelectTemp