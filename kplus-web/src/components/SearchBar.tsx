//import axios from "axios"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../axiosConfig"
interface sBarType{
    isScroll? : boolean,
    sboxState: boolean,
    onFocus: (e: boolean) => void,
    boxHandler: () =>void,
    getFilmes: (e: any) => void,
    searchClick:() => void
}

const SearchBar = ({isScroll=false,sboxState,onFocus,boxHandler,getFilmes,searchClick}:sBarType) =>{
    const nav = useNavigate()
    const handleKeyDown = (e:any) =>{
        if(e.key == 'Enter' && query.trim()!=''){
           nav(`search/${query}`);
           searchClick()
        }
    }
    const [query,setQuery] = useState<any>("")
    const [isClicked,setIsClicked] = useState(false)
    const[sbarState,setSbarState] = useState(false)
    const handleText = (e: any) => {
        setQuery(e.target.value)
        if(sboxState != true){
          if( e.target.value.length > 0) {
           boxHandler()
        }}
    }
    const handleBlur = (e: boolean) =>{
        onFocus(e)
        setSbarState(e)
    }
    const getMovies = async() =>{
        await axiosInstance.get("/search",{
            params:{
                query: query
            }
        })
        .then(response => {
            console.log(response.data)
            getFilmes(response.data)
        })
        .catch(error => {
            console.log("Erro ao carregar filme",error)
        })
    }
    useEffect(()=>{

        if(sboxState == false && sbarState == false){
            setIsClicked(false)
            setQuery(undefined)
        }
    },[sbarState,sboxState])
    useEffect(()=>{
        if(query && query.trim() !==""){
      getMovies()
        }
    },[query])
    return(
        <div className="flex justify-end text-gray-500 items-center mx-4 h-full flex-grow transition-all duration-300 ">
        {
        isClicked ? (
        <div className = "w-full h-6 flex  items-center pr-2 h-full py-0.5 bg-white rounded-full" onBlur={()=>handleBlur(false)} onFocus={()=>handleBlur(true)}>
        <input
        type="text"
        value={query}
        placeholder="Pesquisar"
        onChange={handleText}
        className="flex-grow h-6 bg-white rounded-full placeholder:text-gray-500 px-3 outline-none "
        onKeyDown={handleKeyDown}
        autoFocus
        />
        <FaSearch className="mx-2"/>
        </div>):

        (
            <div className={`flex justify-center items-center   mr-2 ${isScroll ? ' hover:bg-bgpurplehover/80 ': 'hover:bg-bgpurplehover'} rounded-full h-8 w-8`} onClick={()=>setIsClicked(true)}>
                <FaSearch className="text-gray-200"/>
            </div>
        )
    }
        </div>
    )
}
export default SearchBar
