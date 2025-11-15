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
const [userKey, setUserKey] = useState<string | null>(localStorage.getItem('user'))
const [tokenKey, setTokenKey] = useState<string | null>(localStorage.getItem('token'))
const [contaKey, setContaKey] = useState<string | null>(localStorage.getItem('idConta'))
const [userData,setUserData] = useState<userData>()
const [boxVisibity,setBoxVisibility] = useState<boolean>(false)
const [isOverBox,setIsOverBox] = useState<boolean>(false)
const [showBox,setShowBox] = useState(false)
const nav = useNavigate()
const loadUser = async() =>{
    const token = tokenKey;
    const conta = contaKey;
    const user = userKey;
    if(token && conta && user){
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
    } else {
      setUserData(undefined)
    }
}
const handleClick = () =>{
  localStorage.removeItem('user')
  localStorage.removeItem('idConta')
  localStorage.removeItem('token')
  // notifica outras partes da aplicação que o usuário mudou
  window.dispatchEvent(new Event('userChanged'))
  setUserKey(null)
  setTokenKey(null)
  setContaKey(null)
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
// Carrega dados do usuário quando as chaves mudam
useEffect(()=>{
  loadUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[userKey, tokenKey, contaKey])

// Escuta mudanças no localStorage vindas de outras abas
useEffect(()=>{
  const onStorage = (e: StorageEvent) =>{
    if(e.key === 'user') setUserKey(localStorage.getItem('user'))
    if(e.key === 'token') setTokenKey(localStorage.getItem('token'))
    if(e.key === 'idConta') setContaKey(localStorage.getItem('idConta'))
  }
  // Evento customizado para mudanças na mesma aba
  const onUserChanged = () =>{
    setUserKey(localStorage.getItem('user'))
    setTokenKey(localStorage.getItem('token'))
    setContaKey(localStorage.getItem('idConta'))
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('userChanged', onUserChanged)

  // fallback: checagem periódica para detectar mudanças feitas sem disparar evento
  const interval = setInterval(()=>{
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    const c = localStorage.getItem('idConta')
    if(u !== userKey) setUserKey(u)
    if(t !== tokenKey) setTokenKey(t)
    if(c !== contaKey) setContaKey(c)
  },1000)

  return ()=>{
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('userChanged', onUserChanged)
    clearInterval(interval)
  }
},[userKey, tokenKey, contaKey])
return(
    <>
    {userKey && userData?(
      <div className="relative">
        <div onMouseEnter={()=>setBoxVisibility(true)} onMouseLeave={()=>setBoxVisibility(false)}className="rounded-full overflow-hidden h-10 w-10 flex justify-center items-center">
        <img src={`http://localhost:5000${userData.thumb_url}`} className="h-full object-cover flex justify-center items-center"/>
      </div>
      {
      (showBox)&&(
      <div onMouseEnter={()=>setIsOverBox(true)} onMouseLeave={()=>setIsOverBox(false)} className="h-full w-64 bg-red-500 absolute top-12 mt-2 rounded-sm right-0 items-center justify-center flex flex-col">
        <button onClick={()=>nav('/usuarios')} className="bg-red-600 w-64 hover:bg-red-700">Configurações de usuarios</button>
         <button onClick={()=>{handleClick()}} className="bg-red-600 w-64 hover:bg-red-700">Sair</button>
      </div>
      )
      }
      </div>
    ):(
      <div onClick={()=>nav('/login')} className="rounded-full overflow-hidden h-10 w-10 flex justify-center items-center">
        <img src={`http://localhost:5000/Users/iconeDefault_user.svg`} className="h-full object-cover flex justify-center items-center"/>
      </div>
    )
    }
    </>
)
}
export default UserIcon