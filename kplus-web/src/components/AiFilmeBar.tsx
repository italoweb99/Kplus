import { useEffect, useState } from "react"
import axiosInstance from "../axiosConfig"
import CaroselExtended from "./CaroselExtended";
import Carrossel2 from "./Carossel2";
interface filmeData{
    id: Number,
    titulo: String
}
const AiFilmeBar = () =>{
    const [filmes,setFilmes] = useState<filmeData[]>([]);
   
    useEffect(()=>{
       axiosInstance.post('/gia',{
            generos: ['Aventura','Ação'],
            pk: ['Dinossauro']
        })
        .then(response =>{
            console.log(response.data)
        setFilmes(response.data)})
       .catch(err =>(
        console.log(err)
       ))
    },[]) 
    return(
        <div className="h-screen ">
             <CaroselExtended obj = {filmes} width= {50} height={70} />
             <Carrossel2 obj ={filmes} width={50} height={70} titulos={true} />
        </div>
    )
}
export default AiFilmeBar