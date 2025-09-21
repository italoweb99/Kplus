import { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { FaCompress, FaExpand, FaPause, FaPlay } from "react-icons/fa";
import ExpandIcon from "./ExpandIcon";
import ContractIcon from "./ContractIcon";

interface PlayerProp{
  src: string;
  tempAssist: any;
  id: any;
  tipo: any;
}
const Player = ({src,tempAssist = null,id,tipo}:PlayerProp) =>{
    const [duration,setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime,setCurrentTime]=useState(0);
    const [isPlaying,setIsPlaying] = useState(false);
    const[isFullScreen,setIsFullScreen] = useState(false)
    const playerRefConteiner = useRef<HTMLDivElement>(null);
   // ... dentro do componente Player
const [isControlsVisible, setIsControlsVisible] = useState(false);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    //const [isLoading,setLoading] = useState(true)
    //const lastSaveTime = useRef(0);
   /* useEffect(()=>{
        if(tempAssist != null && videoRef.current != null){
            videoRef.current.currentTime = tempAssist;
         
        }
    },[tempAssist]);*/
    
useEffect(() => {
  const saveProgress = async () => {
    try {
      await axiosInstance.post('/reproduzir/saveTempo',
        {
          video_id: id,
          tempo_assist: videoRef.current ? videoRef.current.currentTime : 0,
          id_user: localStorage.getItem('user'),
          tipo: tipo
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (err) {
      console.error('erro', err);
    }
  };

  const interval = setInterval(() => {
    if (videoRef.current && !videoRef.current.paused) {
      saveProgress();
    }
  }, 10000); // 10 segundos

  return () => {
    clearInterval(interval);
    if(videoRef.current && videoRef.current.currentTime>0)
    saveProgress(); // Salva ao desmontar
  };
}, []);
    const handlePlay = () =>{
     isPlaying ? videoRef.current? videoRef.current.pause(): '' : videoRef.current? videoRef.current.play(): "";
     setIsPlaying(!isPlaying);
    }
    const handleMetaData = () =>{
      if(videoRef.current){
       setDuration(videoRef.current.duration);
      if(tempAssist !=null){
        videoRef.current.currentTime = tempAssist;
      }
    }
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
    const handleFullScreen = ()=>{
        if(playerRefConteiner.current){
          if(document.fullscreenElement){
            document.exitFullscreen()
            setIsFullScreen(false)
          }
          else{
            playerRefConteiner.current.requestFullscreen()
            setIsFullScreen(true)
          }
        }
    }
    // ... dentro do componente Player
const handleMouseMove = () => {
  // Mostra os controles
  setIsControlsVisible(true);

  // Limpa o temporizador anterior, se houver
  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  // Define um novo temporizador para esconder os controles
  timerRef.current = setTimeout(() => {
    setIsControlsVisible(false);
  }, 3000); // Esconde após 3 segundos
};

const handleMouseLeave = () => {
  // Limpa o temporizador e esconde os controles imediatamente
  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }
  setIsControlsVisible(false);
};
return(
    <div ref={playerRefConteiner} onMouseMove ={handleMouseMove} onMouseLeave={handleMouseLeave}className="h-screen">
      
    <video ref={videoRef} onTimeUpdate={handleTimeUpdate} className="bg-black h-screen w-screen"src={src} onLoadedMetadata={handleMetaData}>
        </video>
       <div
        className={`absolute bg-black/60	 bottom-0 left-0 w-full h-full flex flex-col justify-end items-center p-4 transition-opacity duration-300 ${
          isControlsVisible ? ' opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: isControlsVisible ? 'auto' : 'none' }}
      >
        <div className="h-full flex justify-center items-center">
          <button className="text-white mt-2" onClick={handlePlay}>
          {isPlaying ? <FaPause size={40}/>:<FaPlay size={40}/> }
        </button>
         </div>
        <div className="justify-between flex w-full">
        <p className="text-white">{`${currentTime.toFixed(2)} / ${duration.toFixed(2)}`}</p>
      { !isFullScreen? (
        <ExpandIcon onClick={handleFullScreen} size={25} color="white"/>
      ):(
        <ContractIcon onClick={handleFullScreen}size={25} color='white'/>
      )
         
      }
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className='w-full'
        />
      
      </div>
        </div>
)
}
export default Player;