//import axios from "axios";
import {  useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Carrossel = ({height=150,time = 10000}) =>{
   
    const wdToPixel = window.innerWidth;
    const hgToPixel = height*4;
    const [current, setCurrent] = useState(0);
    const [imgs,setFilmes] =useState<any[]>([]);
   const[isLoading,setIsLoading] = useState(true);
    const getFilmes = async () =>{
        await axiosInstance.get('/destaques')
        .then(response =>{

            setFilmes(response.data);
          setIsLoading(false);
      
           
        })
       .catch(error => {
        console.log("Erro ao carregar filmes", error);
       })
       
    }
    useEffect(()=>{
        getFilmes();
    },[])
    const next = () =>{
    current == imgs.length-1 ? setCurrent(0) : setCurrent(current+1);
    }
    const prev = () =>{
       current==0 ? setCurrent(imgs.length-1) : setCurrent(current-1);
    }
    useEffect(()=>{
        const interval = setInterval(()=>{
            next();
        },time);
        return ()=> clearInterval(interval);
    },[current])
    return(
        <div>
              { isLoading &&
                <div className="bg-gray-500"style={{
                    width: '100vw',
                    height: hgToPixel
                }}></div>
                 }  
        <div className="relative overflow-hidden ">
            <div className="flex transiton justify-start items-start ease-out duration-500" style={{
                transform: `translateX(-${current*(wdToPixel)}px)`,
                width: imgs.length*wdToPixel
                
            }}>
                <>
              
                {
                  imgs.map((img)=>(
                   <Link to={`/filmes/${img.id}`} key ={img.id}>
                    <div>
                    <img 
                    src={`http://localhost:5000${img.thumb_url}`} 
                    onLoad={()=>setIsLoading(false)}
                    style={{
                       width: '100vw',
                       height: hgToPixel
                    }} 
                    className="shrink-0"
                  />
                  <div className="absolute bottom-0 h-26 w-screen bg-gradient-to-t from-bgpurple from-20% to-transparent to-100% text-gray-200 text-4xl font-bold" >
                    <h1 className="mx-10">{img.title}</h1>
                  </div>
                  
                  </div>
                  </Link>
                  ))
                }
            </>
            </div>
            {
         
         <div  className="pointer-events-none  text-transparent absolute top-0 h-full w-full flex justify-between items-center  text-4xl ">
              <div className="flex items-center bg-gradient-to-r transition ease-out duration-500 hover:from-black/90  to-transparent  hover:text-white hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto "onClick={()=>prev()} style={{
                width: wdToPixel*0.05
            }}>
            <FaChevronLeft className="hover:text-5xl transition-all ease-out duration-300"/>
            </div>
           
            <div className="flex items-center bg-gradient-to-l transition ease-out duration-500 hover:from-black/90   to-transparent  hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto  hover:text-white" onClick={()=>next()} style={{
                    width: wdToPixel*0.05
                }}>
            <FaChevronRight className="hover:text-5xl transition-all ease-out duration-300"/>
                </div>
                </div>
            }
        </div>
        </div>
    );
}
export default Carrossel