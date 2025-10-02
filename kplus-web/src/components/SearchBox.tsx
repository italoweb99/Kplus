import { useEffect,} from "react"
import { useNavigate } from "react-router-dom"

interface sbType  {
        ref: any,
        onFocusParam: (e: boolean) => void,
        filmeList: { filmes: any[], series: any[] }
}
const SearchBox = ({ref, onFocusParam,filmeList}:sbType) =>{
        const nav = useNavigate()
        const clickHandle = (item: any, tipo: 'filme' | 'serie') =>{
                if(tipo === 'filme'){
                        nav(`/filmes/${item.id}`)
                } else if(tipo === 'serie'){
                        nav(`/series/${item.id}`)
                }
                onFocusParam(false)
        }
        useEffect(()=>{
                onFocusParam(true);
        },[])
        const filmes = filmeList.filmes || [];
        const series = filmeList.series || [];
        const total = filmes.length + series.length;
        return(
            <div ref={ref} className="bg-bgpurple/80 backdrop-blur-sm hover:text-gray-300 text-gray-200  overflow-auto flex flex-col mx-20 p-8 h-[500px] rounded-b-xl" >
             {
                total > 0 ? (
                    <>
                        {filmes.map(item => (
                            <div key={'filme'+item.id} onClick={()=>clickHandle(item, 'filme')} className="flex items-center my-1 transition-all ease-out duration-300 mx-3 cursor-pointer hover:bg-bgpurplehover/80 rounded-lg"  >
                                <img src={`http://localhost:5000${item.thumb_url}`} className="h-28 w-28 rounded-s-lg"/>
                                <p className="ml-20 font-medium">{item.titulo}</p>
                                <span className="ml-4 text-xs text-gray-400 uppercase">Filme</span>
                            </div>
                        ))}
                        {series.map(item => (
                            <div key={'serie'+item.id} onClick={()=>clickHandle(item, 'serie')} className="flex items-center my-1 transition-all ease-out duration-300 mx-3 cursor-pointer hover:bg-bgpurplehover/80 rounded-lg"  >
                                <img src={`http://localhost:5000${item.thumb_url}`} className="h-28 h-28 object-cover rounded-s-lg"/>
                                <p className="ml-20 font-medium">{item.titulo}</p>
                                <span className="ml-4 text-xs text-gray-400 uppercase">Série</span>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-gray-200 flex justify-center items-center mt-16">Nenhum resultado encontrado</p>
                )
             }
            </div>
        )
}
export default SearchBox