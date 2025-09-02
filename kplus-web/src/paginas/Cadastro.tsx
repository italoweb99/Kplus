
import { useState } from "react"
import axiosInstance from "../axiosConfig";

const Cadastro = () =>{
    const [formData,setFormData] = useState([{nome:'',email:'',senha:''}]);
    const[message,setMessage] = useState ('');
    const handleChange = (e: any) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const enviar = (e: any) =>{
     e.preventDefault();
     axiosInstance.post('/cadastro', formData)
     .then(response =>{ setMessage(response.data.message);})
     .catch(error => { setMessage(error);

     });
    }
return(
<div className="flex">
<input type="text" name = "nome" placeholder="Nome" onChange={handleChange} required/>
<input type="email" name = "email" placeholder="Email" onChange={handleChange} required/>
<input type="senha" name = "senha" placeholder="Senha" onChange={handleChange} required/>
<button onClick={enviar}>Enviar</button>
</div>
)
}
export default Cadastro