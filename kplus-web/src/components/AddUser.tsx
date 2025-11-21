import { useEffect, useState } from "react"
import axiosInstance from "../axiosConfig";
import SelectUserThumb from "./SelectUserThumb";
import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";

interface AddUserProps{
    isEdit?: boolean;
    onClose: (e: any) => void;
    perfil?: any;
}
const AddUser = ({isEdit=false,onClose,perfil=null}: AddUserProps) =>{
    const [openThumbs,setOpenThumbs] = useState(!isEdit);
    const [formData,setFormData] = useState({nome:'',id_user_thumb:'',thumb_url:'/Users/iconeDefault_user.svg'});
    const [submitting,setSubmitting] = useState(false);

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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleChange = (e: any) =>{
        const{name,value} = e.target;
        setFormData(formData =>({
            ...formData,
            [name]:  value
        }));
    }

    const handleClose = (e: any) => {
        const {id,url} = e;
        setFormData(prev => ({
            ...prev,
            id_user_thumb: id,
            thumb_url: url
        }));
        setOpenThumbs(false);
    }

    const handleSubmit = async (ev?: any) =>{
        if(ev) ev.preventDefault();
        setSubmitting(true);
        const idConta = localStorage.getItem('idConta');
        const url = isEdit ? `usuarios/${idConta}/${perfil}` : `/usuarios/${idConta}`
        const metodo = isEdit ? 'put' : 'post'
        try{
          await axiosInstance[metodo](url,formData,{
              headers:{
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          onClose('enviar');
        }catch(error){
          console.log("erro ao atualizar perfil",error);
        }finally{
          setSubmitting(false);
        }
    }

    const handleDelete = async () =>{
        if(!confirm("Deseja realmente deletar este perfil?")) return;
        const idConta = localStorage.getItem('idConta');
        try{
          await axiosInstance.delete(`/usuarios/${idConta}/${perfil}`,{
              headers:{
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          onClose('enviar');
        }catch(error){
          console.log('Error ao deletar perfil',error);
        }
    }

    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onClose("cancelar")}
          aria-hidden
        />

        <div className="relative w-full max-w-md mx-4">
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xl p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isEdit ? 'Editar perfil' : 'Adicionar perfil'}
              </h3>
              <button
                onClick={() => onClose('cancelar')}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-300"
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setOpenThumbs(true)}
                className="rounded-full overflow-hidden h-24 w-24 border-2 border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none"
                aria-label="Selecionar avatar"
              >
                <img
                  src={`http://localhost:5000${formData.thumb_url}`}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </button>

              <form className="w-full mt-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-slate-700 dark:text-slate-200 mb-1">Nome</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome do perfil"
                  required
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* hidden fields (se necessário) */}
                <input type="hidden" name="id_user_thumb" value={formData.id_user_thumb as any} />

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onClose('cancelar')}
                    className="flex-1 px-4 py-2 rounded-md bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 hover:opacity-95"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 px-4 py-2 rounded-md text-white ${submitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <FaCheck /> {isEdit ? 'Salvar' : 'Enviar'}
                    </span>
                  </button>

                  {isEdit &&
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                    >
                      <FaTrash />
                    </button>
                  }
                </div>
              </form>
            </div>
          </div>

          {/* thumbs selector modal */}
          {openThumbs && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-800 dark:text-slate-100">Selecionar avatar</h4>
                  <button className="text-slate-500 hover:text-slate-700" onClick={() => setOpenThumbs(false)}>
                    <FaTimes />
                  </button>
                </div>
                <SelectUserThumb onClose={handleClose} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
}
export default AddUser