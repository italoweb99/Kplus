import { Link, useParams } from "react-router-dom"
import InfiniteScroll from "../components/InfiniteScroll"
import axiosInstance from "../axiosConfig";
import { useState } from "react";
interface Item{
    tipo:String;
    titulo:String;
    sinopse:String;
    id: Number;
    
    thumb_url: String;

}
const SearchPage = () =>{
const {query} = useParams()
const [hasMore,setHasMore] = useState(true)
 const fetchFilmes = async (page: number): Promise<Item[]> => {
    const res = await axiosInstance.get(`/search`,{
        params:{
            query: query,
            page: page
        }
    });
    // Se vier menos do que o esperado, acabou a lista
    const items = [...(res.data.filmes||[]),...(res.data.series ||[])]
    if (res.data.length < 20) setHasMore(false);
    else setHasMore(true);
    return items;
  };
return(
   <InfiniteScroll
   fetchData={fetchFilmes}
   hasMore ={hasMore}
   renderItem={(item: Item, index: number)=>(
    item.tipo == 'filme' ?(
           <div className="flex flex-col items-center justify-center" key={`filme-${item.id}-${index}`}>
            <Link to={`/filmes/${item.id}`}>
              <img src={`http://localhost:5000${item.thumb_url}`} className="h-56 rounded-lg" />
            </Link>
            <h1 className='m-2 line-clamp-1'>{item.titulo}</h1>
          </div>
    ):(
           <div className="flex flex-col items-center justify-center" key={`serie-${item.id}-${index}`}>
            <Link to={`/series/${item.id}`}>
              <img src={`http://localhost:5000${item.thumb_url}`} className="h-56 rounded-lg" />
            </Link>
            <h1 className='m-2 line-clamp-1'>{item.titulo}</h1>
          </div>
    )
)}
 className="grid grid-cols-6 gap-4 m-2"
   />
)
}
export default SearchPage