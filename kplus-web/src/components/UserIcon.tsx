import axios from "axios"
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
useEffect(()=>{
loadUser()
},[])
return(
    <>
    {user && userData?(
        <div className="rounded-full overflow-hidden h-20 w-20 flex justify-center items-center">
        <img src={`http://localhost:5000${userData.thumb_url}`} className="h-full object-cover flex justify-center items-center"/>
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