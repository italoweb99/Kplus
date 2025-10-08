//import axios from "axios"
import axiosInstance from "../axiosConfig"
import { useEffect, useState } from "react"
import { useNavigate} from "react-router-dom"
interface userData {
    id_user_thumb: Number,
    Nome: String,
    thumb_url: String
}
const UserIcon = () =>{
const user = localStorage.getItem('user')
const token =localStorage.getItem('token')
const conta = localStorage.getItem('idConta')
const [userData,setUserData] = useState<userData>()
const [boxVisibity,setBoxVisibility] = useState<boolean>(false)
const [isOverBox,setIsOverBox] = useState<boolean>(false)
const [showBox,setShowBox] = useState(false)
const nav = useNavigate()
const loadUser = async() =>{
    try{
       const res= await axiosInstance.get(`usuarios/${conta}/${user}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
       })
       
       setUserData(res.data)
    }
    catch(err){
        console.log(err)
    }
}
const handleClick = () =>{
  localStorage.removeItem('user')
  localStorage.removeItem('idConta')
  localStorage.removeItem('token')
  nav('/')
}
useEffect(()=>{
  let timeout: NodeJS.Timeout;
  if(!boxVisibity&&!isOverBox){
    timeout = setTimeout(()=>setShowBox(false),300);
  }
  else{
    setShowBox(true);
  }
  return () => clearTimeout(timeout)
},[boxVisibity,isOverBox])
useEffect(()=>{
loadUser()
},[])
return(
    <>
    {user && userData?(
      <div className="relative">
        <div onMouseEnter={()=>setBoxVisibility(true)} onMouseLeave={()=>setBoxVisibility(false)}className="rounded-full overflow-hidden h-20 w-20 flex justify-center items-center">
        <img src={`http://localhost:5000${userData.thumb_url}`} className="h-full object-cover flex justify-center items-center"/>
      </div>
      {
      (showBox)&&(
      <div onMouseEnter={()=>setIsOverBox(true)} onMouseLeave={()=>setIsOverBox(false)} className="h-full w-64 bg-red-500 absolute top-20 mt-2 rounded-sm left-0 items-center justify-center flex flex-col">
        <button onClick={()=>nav('/usuarios')} className="bg-red-600 w-64 hover:bg-red-700">Configurações de usuarios</button>
         <button onClick={()=>{handleClick()}} className="bg-red-600 w-64 hover:bg-red-700">Sair</button>
      </div>
      )
      }
      </div>
    ):(
      <div onClick={()=>nav('/login')} className="rounded-full overflow-hidden h-20 w-20 flex justify-center items-center">
        <img src={`http://localhost:5000/Users/iconeDefault_user.svg`} className="h-full object-cover flex justify-center items-center"/>
      </div>
    )
    }
    </>
)
}
export default UserIcon