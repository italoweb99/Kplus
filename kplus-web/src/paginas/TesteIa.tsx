import { useState } from "react"
import AiFilmeBar from "../components/AiFilmeBar"
import GenSelecter from "../components/GenSelecter"
import ContractIcon from "../components/ContractIcon"
import ExpandIcon from "../components/ExpandIcon"
import Loader from "../components/Loader"
import UserIcon from "../components/UserIcon"
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
    <div>
    <ContractIcon size={50} color='#8A00C4' onClick={()=>{console.log('click')}}/>
        </div>
        <ExpandIcon size={50}/>
        <Loader color="purple" size={300}/>
        <UserIcon/>
    </>
)
}
export default TesteIa