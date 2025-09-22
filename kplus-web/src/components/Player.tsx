import { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { FaPause, FaPlay } from "react-icons/fa";
import ExpandIcon from "./ExpandIcon";
import ContractIcon from "./ContractIcon";
import { useNavigate } from "react-router-dom";
import { RiForward10Fill, RiReplay10Fill } from "react-icons/ri";

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
    const[showNextEp,setShowNextEp] = useState(false)
    const playerRefConteiner = useRef<HTMLDivElement>(null);
   const [isFinal10s, setIsFinal10s] = useState(false);
   const[nextEp,setNextEp] = useState(null)
const [isControlsVisible, setIsControlsVisible] = useState(false);
const [autoNextCountdown, setAutoNextCountdown] = useState(5);
const autoNextInterval = useRef<NodeJS.Timeout | null>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const nav = useNavigate()
    //const [isLoading,setLoading] = useState(true)
    //const lastSaveTime = useRef(0);
   /* useEffect(()=>{
        if(tempAssist != null && videoRef.current != null){
            videoRef.current.currentTime = tempAssist;
         
        }
    },[tempAssist]);*/
   


    // Contagem regressiva automática para o próximo episódio, pausando e retomando de onde parou
    useEffect(() => {
      let isMounted = true;
      if (showNextEp && nextEp && !videoRef.current?.paused) {
        if (!autoNextInterval.current) {
          autoNextInterval.current = setInterval(() => {
            setAutoNextCountdown((prev) => {
              if (!isMounted) return prev;
              if (prev <= 1) {
                if (autoNextInterval.current) {
                  clearInterval(autoNextInterval.current);
                  autoNextInterval.current = null;
                }
                if (isMounted) {
                  setShowNextEp(false);
                  setIsFinal10s(false);
                  nav(`/reproducao/serie/${nextEp}`);
                }
                return 5;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        if (autoNextInterval.current) {
          clearInterval(autoNextInterval.current);
          autoNextInterval.current = null;
        }
      }
      return () => {
        isMounted = false;
        if (autoNextInterval.current) {
          clearInterval(autoNextInterval.current);
          autoNextInterval.current = null;
        }
      };
    }, [showNextEp, nextEp, isPlaying, nav]);
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
    const handleNextEp = async () =>{
      try{
        const result = await axiosInstance.get(`/series/proximoEp/${id}`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      
        if(result.data.proximo_episodio != null){
         
          setNextEp(result.data.proximo_episodio)
          setShowNextEp(true)
        }
      }
      catch(err){
        console.log(err)
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

const plusTenSeg=()=>{
  if(videoRef.current){
    videoRef.current.currentTime = videoRef.current.currentTime+1
  }
}
const minusTenSeg=()=>{
  if(videoRef.current){
    videoRef.current.currentTime = videoRef.current.currentTime-1
  }
}


const handleTimeUpdate = () => {
  if (videoRef.current) {
    setCurrentTime(videoRef.current.currentTime);

    const remaining = videoRef.current.duration - videoRef.current.currentTime;
    if (remaining <= 10 && !isFinal10s) {
      setIsFinal10s(true);
      if(tipo == 'serie'){
     handleNextEp()
      }
    } else if (remaining > 10 && isFinal10s) {
      setIsFinal10s(false);
      setShowNextEp(false)
    }
  }
};








return(
    <div ref={playerRefConteiner} onMouseMove ={handleMouseMove} onMouseLeave={handleMouseLeave}className="h-screen">
      
    <video ref={videoRef} onTimeUpdate={handleTimeUpdate} className="bg-black h-screen w-screen"src={src} onLoadedMetadata={handleMetaData}>
        </video >
          { showNextEp &&
          <div className="absolute bottom-30 right-10 z-10">
         <button onClick={()=>{ setShowNextEp(false); setIsFinal10s(false); setAutoNextCountdown(5); nav(`/reproducao/serie/${nextEp}`)}}
         className={`bg-white text-black p-2 rounded-md shadow-md`}>Próximo episódio em {autoNextCountdown}s...</button>
         </div>
          }
       <div
        className={`absolute bg-black/60	z-1 bottom-0 left-0 w-full h-full flex flex-col justify-end items-center p-4 transition-opacity duration-300 ${
          isControlsVisible ? ' opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: isControlsVisible ? 'auto' : 'none' }}
      >
        <div className="h-full flex justify-center items-center space-x-20">
          <RiReplay10Fill onClick={minusTenSeg} className="text-white hover:text-gray-300"  size={40}/>
          <button className="text-white" onClick={handlePlay}>
          {isPlaying ? <FaPause size={40}/>:<FaPlay size={40}/> }
        </button>
         <RiForward10Fill onClick={plusTenSeg} className="text-white hover:text-gray-300" size={40}/>
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