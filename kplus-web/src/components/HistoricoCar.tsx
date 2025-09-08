
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "./Carossel2";

const HistoricoCar =({user}:{user: string})=>{
    const [hist,setHist] = useState<any[]>();
        const [loading,setLoading] = useState(true);
        const token= localStorage.getItem('token');
    useEffect(()=>{
        axiosInstance.get(`/historico/${user}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setHist(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.log("Erro ao carregar historico: ",error);
            setLoading(false);
        })
    },[]);
    return(
        <>

        { 
            !loading && user && hist && hist.length > 0 && (
                <>
        <p>Continuar assistindo</p>
        <Carrossel2  obj = {hist} titulos = {true} contAssist = {true}/>   
        </>
            )
        }
        </>
    );
}
export default HistoricoCar