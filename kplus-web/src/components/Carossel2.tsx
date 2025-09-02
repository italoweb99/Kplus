
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import ThumbFrame from "./ThumbFrame";
interface Carrossel2Props{
    obj: any;
    width?: number;
    marginStart?: number;
    height?:number,
    isloading?: boolean;
    titulos?: boolean;
    contAssist?: boolean;
    isFav?: boolean;
    onDelete?: (e: any) => void;
  
}

const Carrossel2 = ({obj,width = 50,height = 40, marginStart = 0.2,isloading = false,titulos=false,contAssist=false,isFav = false,onDelete = () =>{}}:Carrossel2Props) =>{
 
    const wdToPixel = width*4;
    const [current, setCurrent] = useState(0);
    const { innerWidth: widthS} = window;
    //const [isloading ,setIsLoading] = useState(true);
    const [showControls,setShowControls] = useState(false);
    const [showRControl,setShowRControl] = useState(true);
   const [isEdit,setEdit] = useState(false);
    useEffect(()=>{
        wdToPixel*obj.length+wdToPixel*marginStart >= widthS ? setShowControls(true) : setShowControls(false);
    },[widthS,obj])
    const next = () =>{
       // wdToPixel*(imgs.length - current-1) <= width ? setShowRControl(false) : setCurrent(current+1);
        if(wdToPixel*(obj.length - current-1)+wdToPixel*marginStart <= widthS){
            setCurrent(current+1);
            setShowRControl(false);
        }
        else{
            setCurrent(current+1);
        }
    }
    const prev = () =>{
       current==0 ? setCurrent(0) : setCurrent(current-1);
       if(!showRControl){
        setShowRControl(true);
       }
    }

  
    return(

            
        <div className="w-full">
        <div className="relative overflow-hidden">
                        {isFav&&
            <button onClick={()=>setEdit(!isEdit)} style={{marginLeft: wdToPixel*marginStart}} className="text-white">Editar</button>
}
         {
            
             isloading &&
                <div className="flex space-x-3" style={{
                    marginInlineStart: `${wdToPixel*marginStart}px`,
                    width: 8 * wdToPixel
                }}>
                    {
                Array.from({length: 8}, (index: number) =>(
                    <div key={index} className="rounded-md bg-gray-500" style={{
                        width: `${wdToPixel}px`,
                           height: `${wdToPixel*1.5}px`
                    }}></div>
                ))
            }
                </div>
         }
            <div  className="flex space-x-3 transition ease-out duration-500 py-4" style={{
                transform: `translateX(-${current*(wdToPixel)}px)`,
                marginInlineStart: `${wdToPixel*marginStart}px`,
                width: obj.length*wdToPixel
            }}>
                
                {
                   ! isloading && 
                  obj.map((item: any) =>(
                    <div key = {item.id} className={`text-gray-200 relative w-full ${!isEdit ? 'hover:scale-110': ''} transition-all duration-300`}
                    >
                    {
                    item.tipo == 'Filme' ? (
                        <>
                        {                     contAssist ? (
                            <>
                            <Link to = '/filmes' key = {`${item.tipo}-${item.id}`}>
                   <ThumbFrame  src={`http://localhost:5000${item.thumb_url}`}  tempo_assist = {item.tempo_assist} duracao={item.duracao} width={width} height={height}/>
                   </Link>
                   </>
                        ):(
                            <>
                            {
                                isEdit &&
                                <div onClick={()=>onDelete(item)}className="absolute top-0 right-0 h-6 w-6 bg-red-500 hover:scale-110 rounded-full translate-x-1/3 -translate-y-1/3 origin-center z-20 flex justify-center items-center"><FaTimes color="white" size={16}/></div>
                            }
                                    <Link to = {`/filmes/${item.id}`} key = {`${item.tipo}-${item.id}`}>
                   <ThumbFrame  src={`http://localhost:5000${item.thumb_url}`}  tempo_assist = {item.tempo_assist} duracao={item.duracao} width={width} height={height}/>
                   </Link>
                            </>
                        )
                   }
                        
                                { titulos &&
                              ( <Link  className= "line-clamp-1" to ={`/filmes/${item.id}`}>{item.titulo}</Link>)
                                }
                               
                 </>
                    ) :(
                      <>
                               {  contAssist ? 
                               (<Link to = '/series' key = {`${item.tipo}-${item.id}`}>
                   <ThumbFrame  src={`http://localhost:5000${item.thumb_url}`}  tempo_assist = {item.tempo_assist} duracao={item.duracao} width={width} height={height}/>
                   </Link>):(
                    <>
                     {
                                isEdit &&
                                <div onClick={()=>onDelete(item)}className="absolute top-0 right-0 h-6 w-6 bg-red-500 rounded-full hover:scale-110 translate-x-1/3 -translate-y-1/3 origin-center flex justify-center items-center z-20"><FaTimes color="white" size={16}/></div>
                            }
                    <Link to = {`/series/${item.id}`} key = {`${item.tipo}-${item.id}`}>
                   <ThumbFrame  src={`http://localhost:5000${item.thumb_url}`}  tempo_assist = {item.tempo_assist} duracao={item.duracao} width={width} height={height}/>
                   </Link>
                   </>
                   )
}    
                                { titulos && (
                                    <>
                                <Link to = {`/series/${item.id}`}>{item.titulo}</Link>
                                {
                                    contAssist &&
                                <p>{`T${item.nm_temp}:E${item.nm_ep}: ${item.titulo_episodio}`}</p>
                                }
                                </>
                                )
                                }
                                </>
                    )
                }
                    </div>
                
                               
                ))
                
                }

            </div>
            {
            showControls&&
            (<div  className="pointer-events-none  text-transparent absolute top-0 h-full w-full flex justify-between items-center  text-2xl ">
            <div className="flex items-center bg-gradient-to-r transition ease-out duration-500 hover:from-black/60 from-30%  to-transparent to-90% hover:text-white hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto "onClick={()=>prev()} style={{
                width: wdToPixel*marginStart
            }}>
            <FaChevronLeft className="hover:text-3xl transition-all ease-out duration-300"/>
            </div>
            {
                showRControl &&
            (
                <div className="flex items-center bg-gradient-to-l transition ease-out duration-500 hover:from-black/60 from-30%  to-transparent to-90% hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto  hover:text-white" onClick={()=>next()} style={{
                    width: wdToPixel*marginStart
                }}>
            <FaChevronRight className="hover:text-3xl transition-all ease-out duration-300"/>
                </div>
            )
            }
            </div>)
            }
        </div>
        </div>
     
    );
}
export default Carrossel2