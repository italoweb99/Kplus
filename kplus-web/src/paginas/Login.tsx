
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login = () =>{
    //TODO: estilizar pagina
    //TODO: Mostra/Esconder senha
    //TODO: Criar botão criar conta
    const [formData,setFormData] = useState({email:'',senha:''});

    const nav = useNavigate();
    const handleChange = (e: any) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const enviar = (e: any) =>{
        e.preventDefault();
        axiosInstance.post('/login',formData)
        .then(response =>{
            localStorage.setItem('idConta',response.data.user.id_conta);
            localStorage.setItem('token', response.data.user.token);
            nav('/usuarios');
        })
        .catch(
            error =>{
                console.log(error.respond.data.error);
            }
        )

    }
    return(
        <div className="flex flex-col">
            <input type="email" name = "email" placeholder="Email" onChange={handleChange} required/>
            <input type="password" name = "senha" placeholder="senha" onChange={handleChange} required />
            <button onClick={enviar}>enviar</button>
        </div>
    )

}
export default Login