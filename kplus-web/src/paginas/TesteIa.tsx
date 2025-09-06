import { useState } from "react"
import AiFilmeBar from "../components/AiFilmeBar"
import GenSelecter from "../components/GenSelecter"

const TesteIa = () =>{
const [genero,setGenero] = useState()
const handleClick =(e:any) =>{
    setGenero(e)
    console.log(genero)
}
return(
    <>
    <GenSelecter Out={handleClick}/>
    <AiFilmeBar/>
    </>
)
}
export default TesteIa