import { useParams } from "react-router-dom"
import Player from "../components/Player"
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
interface Content{
  tempo_assist: number;
}
const PlayerPag = () =>{
    const {id,tipo} = useParams();
    const [content,setContent] = useState<Content>();
    const [isLoading,setLoading] = useState(true);
    const [isLoadingVideo,setLoadingVideo] = useState(true);
    const [videoUrl, setVideoUrl] = useState('');
   useEffect(()=>{
        axiosInstance.get(`/reproduzir/${localStorage.getItem('user')}/${tipo}/${id}`,{
            headers:{
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response.data)
            setContent(response.data);
            setLoading(false);
        })
        .catch(error=>{
            console.log(`Error ao carregar ${tipo}`,error)
            setLoading(false);
        })
    },[])
        
      
        useEffect(() => {
          const token = localStorage.getItem('token');
          axiosInstance.get(`/reproduzir/get-video-url`, {
            headers: { Authorization: `Bearer ${token}` },
            params:{
              tipo: tipo,
              id: id
            }
          })
            .then(response => {
              setVideoUrl(response.data.signedUrl);
            
              setLoadingVideo(false);
              console.log(response.data);
            })
            .catch(error => {
              console.error('Erro ao obter URL do vídeo:', error);
              setLoadingVideo(false);
            });
        }, [tipo, id]);
return(
    <div>
    {!isLoading && !isLoadingVideo &&
    <Player src = {videoUrl} tempAssist={content?.tempo_assist} id={id} tipo={tipo}/>
    }
    </div>
)
}
export default PlayerPag