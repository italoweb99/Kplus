import { useState, useEffect } from "react"
import axiosInstance from "../axiosConfig";
interface generoType{
    id_genero: Number,
    nm_genero: String
}
interface props{
    Out?: (e: any) => void
}
const GenSelecter = ({Out=()=>{}}:props) =>{
const [generos,setGeneros] = useState<generoType[]>();
useEffect(()=>{
    axiosInstance.get('/generos')
    .then(response=>{
        setGeneros(response.data)
    })
    .catch(err=>(
        console.log(err)
    ))
},[])
const ToCap=(e:String)=>{
   return e.charAt(0).toUpperCase() + e.slice(1)
}
return(
    <div>
    <button key={'Todos'} onClick={()=>{Out('Todos')}} className="bg-blue-300 p-2 m-2 text-white text-md rounded-md">Todos</button>
    {
        generos?.map((genero)=>(
            <button key={genero.id_genero.toString()} onClick={()=>{Out(genero.nm_genero)}} className="bg-blue-300 p-2 m-2 text-white text-md rounded-md">{ToCap(genero.nm_genero)}</button>
        ))
    }
    
</div>
)
}
export default GenSelecter