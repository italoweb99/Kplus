import { useEffect, useState } from "react"
import axiosInstance from "../axiosConfig"
interface SelectUserThumbProps{
    onClose: (e: any) => void
}
const SelectUserThumb = ({onClose}:SelectUserThumbProps) =>{
    const [thumbs,setThumbs] = useState<{thumb_url: string; id_user_thumb: number; url: string;}[]>([]);
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        axiosInstance.get('userthumbs',
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        .then(response=>{
            setThumbs(response.data)
            setLoading(false);
        })
        .catch(error =>{
            console.log("Erro ao carregar thumbs",error);
        })
    })
return(
    <div className="fixed z-50 w-screen bg-white h-screen flex items-center justify-center">
    {!loading &&
    <div className="grid grid-cols-8 gap-4">
        {
    thumbs?.map((thumb)=>(
       <img src={`http://localhost:5000${thumb.thumb_url}`} key={thumb.id_user_thumb} className="h-20 w-20 rounded-full object-cover"onClick={()=>onClose({id:thumb.id_user_thumb,url:thumb.thumb_url})}/>
    )

    )
}
    </div>  
}
</div>
)
}
export default SelectUserThumb