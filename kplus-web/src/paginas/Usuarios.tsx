
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import AddUser from "../components/AddUser";
//TODO:adicionar sinalização de editar usuario
const Usuario = () =>{
    const [users,setUsers] = useState<{user: string; nome: string; thumb_url: string}[]>([]);
    const [isAddOpen,setAddOpen] = useState(false);
    const [isEdit,setEdit] = useState(false);
    const [isEditOpen,setEditOpen] = useState(false);
    const [user,setUser] = useState(null);
    const nav = useNavigate();
    const token = localStorage.getItem('token');

    const loadUsers = () =>{
        const token = localStorage.getItem('token');
        const conta = localStorage.getItem('idConta');
        if(token){
        axiosInstance.get(`/usuarios/${conta}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(response =>{
            //console.log(response.data);
            setUsers(response.data);
        })
        .catch(error=>{
            console.log('Acesso Negado ',error);
        })
    }
    else{
        console.log("Acesso Negado ");
    }
    }
    useEffect(()=>{
       loadUsers();
        
    },[])
    const handleClick=(e: any)=>{
        if(isEdit){
            setUser(e.id_user);
            setEditOpen(true);
        }
        else{
        localStorage.setItem('user',e.id_user)
        nav('/');
        }
    }
    const handleClose = (e: any) => {
      if(isAddOpen)  setAddOpen(false);
      if(isEditOpen)  setEditOpen(false);
      if(isEdit) setEdit(false);
      if(e == "enviar") loadUsers();
    }
if(token){
return(
    <div>
        {
            isEditOpen &&
            <AddUser onClose={handleClose} isEdit={true} perfil={user}/>
        }
        {
            isAddOpen && (
                <AddUser onClose={handleClose}/>
            )
        }
    { 
       users.map((user,index)=>(
        <div key={index} onClick={()=>handleClick(user)}>
        <div className=" h-40 w-40 overflow-hidden rounded-full">
            <img src={`http://localhost:5000${user.thumb_url}`} className="object-cover h-full"/>
        </div>
        <p>{user.nome}</p>
        </div>
       ))
    }
    <button className="h-12 w-20" onClick={()=>setAddOpen(true)}>adicionar perfil</button>
    <button className="h-12 w-20" onClick={()=>setEdit(true)}>editar perfil</button>
    </div>
)
}
}
export default Usuario;