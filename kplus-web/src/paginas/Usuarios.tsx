import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import AddUser from "../components/AddUser";
import { FaPen } from "react-icons/fa";

const Usuario = () => {
  const [users, setUsers] = useState<{ id_user?: any; user?: string; nome: string; thumb_url: string }[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showBorder, setShowBorder] = useState(false);
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  const loadUsers = () => {
    const tokenLocal = localStorage.getItem('token');
    const conta = localStorage.getItem('idConta');
    if (tokenLocal) {
      axiosInstance.get(`/usuarios/${conta}`, {
        headers: {
          Authorization: `Bearer ${tokenLocal}`
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
      if (e.id_user) localStorage.setItem('user', e.id_user);
      nav('/');
    }
  };

  const handleClose = (e: any) => {
    if (isAddOpen) setAddOpen(false);
    if (isEditOpen) setEditOpen(false);
    if (isEdit) {
      setEdit(false);
      setShowBorder(false);
    }
    if (e === "enviar") loadUsers();
  };

  const handleEditClick = () => {
    setEdit(prev => !prev);
    setShowBorder(prev => !prev);
  };

  if (token) {
    return (
      <div className="overflow-hidden min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 p-6 flex flex-col items-center">
        {isEditOpen && (
          <AddUser onClose={handleClose} isEdit={true} perfil={user} />
        )}
        {isAddOpen && (
          <AddUser onClose={handleClose} />
        )}

        <div className="w-full  max-w-6xl">
          <header className="flex items-center justify-between mb-48">
            <div>
              <h1 className="text-3xl font-bold text-white">Perfis</h1>
              <p className="text-sm text-slate-300">Escolha ou gerencie perfis da sua conta</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAddOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
              >
                Adicionar perfil
              </button>

              <button
                onClick={handleEditClick}
                className={`px-4 py-2 rounded-md shadow ${isEdit ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-white/90 text-slate-800 hover:bg-white'}`}
              >
                {isEdit ? 'Finalizar edição' : 'Editar perfis'}
              </button>
            </div>
          </header>

          {/* Grid centralizado */}
          <main>
            <div className="mx-auto w-full flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
                {users.map((u, index) => (
                  <div
                    key={u.id_user ?? index}
                    onClick={() => handleClick(u)}
                    className="relative group cursor-pointer flex flex-col items-center"
                  >
                    {isEdit && (
                      <div className="absolute top-1 right-1 z-10 p-2 bg-white text-bgpurple rounded-full shadow-md">
                        <FaPen />
                      </div>
                    )}

                    <div className={`h-40 w-40 rounded-full overflow-hidden flex items-center justify-center transition-transform transform group-hover:scale-105 ${showBorder ? 'ring-4 ring-white' : ''}`}>
                      <img
                        src={`http://localhost:5000${u.thumb_url}`}
                        alt={u.nome}
                        className="object-cover h-full w-full"
                      />
                    </div>

                    <p className="mt-3 text-center text-white/90">{u.nome}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return null;
};

export default Usuario;