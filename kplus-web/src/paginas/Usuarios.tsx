import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import AddUser from "../components/AddUser";
import { FaPen } from "react-icons/fa";

const Usuario = () => {
  const [users, setUsers] = useState<{ user: string; nome: string; thumb_url: string }[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showBorder, setShowBorder] = useState(false); // Novo estado para a borda
  const nav = useNavigate();
  const token = localStorage.getItem('token');
//TODO: estilizar pagina
  const loadUsers = () => {
    const token = localStorage.getItem('token');
    const conta = localStorage.getItem('idConta');
    if (token) {
      axiosInstance.get(`/usuarios/${conta}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.log('Acesso Negado ', error);
          
        });
    } else {
      console.log("Acesso Negado ");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleClick = (e: any) => {
    if (isEdit) {
      setUser(e.id_user);
      setEditOpen(true);
    } else {
      localStorage.setItem('user', e.id_user);
      nav('/');
    }
  };

  const handleClose = (e: any) => {
    if (isAddOpen) setAddOpen(false);
    if (isEditOpen) setEditOpen(false);
    if (isEdit) {
      setEdit(false);
      setShowBorder(false); // Esconde a borda ao sair do modo de edição
    }
    if (e === "enviar") loadUsers();
  };

  const handleEditClick = () => {
    setEdit(true);
    setShowBorder(true); // Mostra a borda ao entrar no modo de edição
  };

  if (token) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        {isEditOpen && (
          <AddUser onClose={handleClose} isEdit={true} perfil={user} />
        )}
        {isAddOpen && (
          <AddUser onClose={handleClose} />
        )}
        <div className="flex space-x-6 justify-center items-center">
        {
          users.map((user, index) => (
            <div className=" group relative flex flex-col h-full w-full justify-center items-center"key={index} onClick={() => handleClick(user)}>
               {isEdit &&
                <div className="group-hover:scale-110 absolute top-0 right-0 h-9 w-9  translate-x-3 translate-y-3 rounded-full bg-blue-500 text-white flex justify-center items-center transition-all duration-300 ease-in-out "><FaPen></FaPen></div>
               }
              <div className={`h-40 w-40 overflow-hidden rounded-full ${showBorder ? 'outline-6 outline-offset-3 group-hover:outline-7 group-hover:outline-offset-4 outline-blue-500 transition-all duration-300 ease-in-out' : ''}`}> {/* Adiciona borda condicionalmente */}
                <img src={`http://localhost:5000${user.thumb_url}`} className="object-cover h-full" alt={user.nome} />
              </div>
              <p className="m-2">{user.nome}</p>
            </div>
          ))
        }
        </div>
        <div className="flex justify-center items-center m-4 ">
        <button className="h-12 w-20" onClick={() => setAddOpen(true)}>adicionar perfil</button>
        <button className="h-12 w-20" onClick={handleEditClick}>editar perfil</button> {/* Usa a nova função */}
        </div>
      </div>
    );
  }
  return null; // ou alguma mensagem de acesso negado se não houver token
};

export default Usuario;