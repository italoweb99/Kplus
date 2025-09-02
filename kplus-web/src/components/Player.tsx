import { useEffect, useRef, useState } from "react";

interface PlayerProp{
  src: string;
  tempAssist: any;
}
const Player = ({src,tempAssist = null}:PlayerProp) =>{
    const [duration,setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime,setCurrentTime]=useState(0);
    const [isPlaying,setIsPlaying] = useState(false);
    useEffect(()=>{
        
        if(tempAssist != null && videoRef.current != null){
            videoRef.current.currentTime = tempAssist;
        }
    },[tempAssist]);
    /*useEffect(()=>{
        axiosInstance.get(src, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => {
              console.log('Streaming iniciado:', response.data);
            })
            .catch(error => {
              console.error('Erro ao acessar o vídeo:', error);
            });
          
    },[])*/
    const handlePlay = () =>{
     isPlaying ? videoRef.current? videoRef.current.pause(): '' : videoRef.current? videoRef.current.play(): "";
     setIsPlaying(!isPlaying);
    }
    const handleMetaData = () =>{
      if(videoRef.current)
       setDuration(videoRef.current.duration);
    }
    const handleTimeUpdate = () =>{
      if(videoRef.current)
        setCurrentTime(videoRef.current.currentTime);
    }
    const handleSeek = (e: any) =>{
        const time = (e.target.value/100)* duration;
        if(videoRef.current)
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    }
return(
    <div>
    <video ref={videoRef} onTimeUpdate={handleTimeUpdate} className="w-1/3"src={src} onLoadedMetadata={handleMetaData}>
        </video>
        <div>
         <p>{`${currentTime}/${duration}`}</p>
         <input
         type="range"
         min={0}
         max={100}
         value={(currentTime/duration)*100 || 0}
         onChange={handleSeek}/>
         <button onClick={handlePlay}>Play</button>
        </div>
        </div>
)
}
export default Player;