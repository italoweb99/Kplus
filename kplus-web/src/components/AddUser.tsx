import { useEffect, useState } from "react"
import axiosInstance from "../axiosConfig";
import SelectUserThumb from "./SelectUserThumb";
interface AddUserProps{
    isEdit?: boolean;
    onClose: (e: any) => void;
    perfil?: any;
}
const AddUser = ({isEdit=false,onClose,perfil=null}: AddUserProps) =>{
    const [openThumbs,setOpenThumbs] = useState(!isEdit);
    //const [idThumb,setIdThumb] = useState(null);
    const [formData,setFormData] = useState({nome:'',id_user_thumb:'',thumb_url:'/Users/iconeDefault_user.svg'});
    useEffect (()=>{
        if(isEdit){
        const idConta = localStorage.getItem('idConta');
        
        axiosInstance.get(`/usuarios/${idConta}/${perfil}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setFormData(response.data);
            
        })
        .catch(error =>{
           console.log("Erro ao carregar perfil",error);
        })

    }},[]);
    const handleChange = (e: any) =>{
        const{name,value} = e.target;
        setFormData(formData =>({
            ...formData,
            [name]:  value
    }));
    }
    const handleClose = (e: any) => {
        const {id,url} = e;
        console.log(id,url);
        setFormData({
            ...formData,
            id_user_thumb: id,
            thumb_url: url
    })
    console.log(formData);
    setOpenThumbs(false);
    }
    const handleSubmit = () =>{
        //TODO: implementar edit server
        const idConta = localStorage.getItem('idConta');
        const url = isEdit ? `usuarios/${idConta}/${perfil}` : `/usuarios/${idConta}`
        const metodo = isEdit ? 'put' : 'post'
        console.log(formData);
        axiosInstance[metodo](url,formData,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response=>{
            console.log("Perfil Atualizado com sucesso",response.data);
            onClose('enviar');
        }
        )
        .catch(
            error=>{
                console.log("erro ao atualizar perfil",error);
            }
        )
    }
    const handleDelete = () =>{
        const idConta = localStorage.getItem('idConta');
        axiosInstance.delete(`/usuarios/${idConta}/${perfil}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response =>{
            console.log('Perfil deletado com sucesso',response.data);
            onClose('enviar');
        })
        .catch(error=>{
            console.log('Error ao deletar perfil',error);
        })
    }
return(
    <div className="h-screen bg-white flex flex-col justify-center items-center w-screen fixed z-20">
{
    openThumbs && (
     <SelectUserThumb onClose = {handleClose}/>
    )
}
<img src={`http://localhost:5000${formData.thumb_url}`} className="h-20 w-20 rounded-full object-cover" onClick={()=>setOpenThumbs(true)}/>
<input type="text" placeholder="nome" name="nome" value={formData.nome} onChange={handleChange}/>
<div className="space-x-2">
    <button onClick = {()=>onClose("cancelar")}>Cancelar</button>
    <button onClick={handleSubmit}>Enviar</button>
    {isEdit &&
    <button onClick={handleDelete}>Deletar</button>
}
</div>
</div>
)
}
export default AddUser