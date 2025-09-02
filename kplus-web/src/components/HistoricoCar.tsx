
import { useEffect, useState } from "react";
import CaroselExtended from "./CaroselExtended";
import axiosInstance from "../axiosConfig";
import Carrossel2 from "./Carossel2";

const HistoricoCar =({user}:{user: string})=>{
    const [hist,setHist] = useState(null);
        const [loading,setLoading] = useState(true);
        const token= localStorage.getItem('token');
    useEffect(()=>{
        axiosInstance.get(`user/${user}/historico`,{
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
         <p>Continuar assistindo</p>
        { 
            !loading &&
        <Carrossel2  obj = {hist} titulos = {true} contAssist = {true}/>   
        }
        </>
    );
}
export default HistoricoCar