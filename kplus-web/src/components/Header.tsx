import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchBox from "./SearchBox";
import UserIcon from "./UserIcon";
//TODO: Colocar o icone de usuario
function Header() {
  const [scrolling, setScrolling] = useState(false);
  const[isSerchBoxOpen, setSearchBoxOpen] = useState(false)
  const[sboxFocus,setSboxFocus] = useState(false);
  const [sbarFocus,setSBarFocus] = useState(false);
  const [filmes, setFilmes] = useState<{ filmes: any[]; series: any[] }>({ filmes: [], series: [] })
  const box: any = useRef(null);
  const btnStyle = `p-2 m-2 text-white text-lg rounded-md ${scrolling? ' hover:bg-bgpurplehover/80 ': 'hover:bg-bgpurplehover'}`;
  const handleFilmes = (e: any) =>{
    setFilmes(e)
  }
  const handleSearchclick = () =>{
    setSBarFocus(false);
    setSboxFocus(false);
  }
  const handleClickOutside = (event: any) =>{
    if(box && box.current && !box.current.contains(event.target)){
      setSboxFocus(false);
    }
  }
  const handleSbarFocus = (e: any) =>{
    setSBarFocus(e)
  }
  const handleFocus = (e: any) =>{ 
    setSboxFocus(e)
  
  }
  const handleBox = () =>{
    setSearchBoxOpen(true)
  
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(()=>{ 
     if(sbarFocus == false && sboxFocus == false){
    setSearchBoxOpen(false)
}
},[sbarFocus,sboxFocus])
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div   className={`fixed top-18 left-0 w-full z-20` }>
    <header
      className={`fixed top-0 left-0 w-full z-20  ${
        scrolling ? "bg-transparent" : "bg-bgpurple"
      }`}
    >
      <div className={`bg-bgpurple/80 mx-10 px-6 py-5 flex  items-center backdrop-blur-sm transition-all duration-300 ${scrolling ? 'shadow-lg rounded-b-xl': 'shadow-none' }`}>
      <Link to ='/' className="rounded-b-xl">
        <h1 className= 'text-2xl font-bold text-gray-200 hover:text-gray-300'>Mockflix</h1>
        </Link>
        <div className="ml-10">
          <Link to ={'/filmes'}>
        <button className={btnStyle}>Filmes</button>
    </Link>
    
    <Link to ={'/series'}>
        <button className={btnStyle}>Séries</button>
    </Link>
    </div>
        <SearchBar isScroll={scrolling} onFocus = {handleSbarFocus} sboxState = {sboxFocus} boxHandler={handleBox} getFilmes={handleFilmes} searchClick = {handleSearchclick}/>
         <UserIcon/>
      </div>
    </header>
    {
      isSerchBoxOpen&&
    <SearchBox ref = {box} onFocusParam={handleFocus} filmeList = {filmes}  />
    }
    </div>
  );
}

export default Header;
