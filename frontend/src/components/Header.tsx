import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchBox from "./SearchBox";
import UserIcon from "./UserIcon";

function Header() {
  const [scrolling, setScrolling] = useState(false);
  const[isSerchBoxOpen, setSearchBoxOpen] = useState(false)
  const[sboxFocus,setSboxFocus] = useState(false);
  const [sbarFocus,setSBarFocus] = useState(false);
  const [filmes, setFilmes] = useState<{ filmes: any[]; series: any[] }>({ filmes: [], series: [] })
  const box: any = useRef(null);
  const btnStyle = `p-2 m-2 text-gray-200 hover:text-gray-300" text-lg rounded-md ${scrolling? ' hover:bg-bgpurplehover/80 ': 'hover:bg-bgpurplehover'}`;
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
      <div className={`bg-bgpurple/80 mx-10 px-6 py-3 flex  items-center backdrop-blur-sm transition-all duration-300 ${scrolling ? 'shadow-lg rounded-b-xl': 'shadow-none' }`}>
      <Link to ='/' className="rounded-b-xl ">
       <svg width="43"  viewBox="0 0 63 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.6784 28.6432L29.2563 36.4824V52.1608L15.6784 60L2.1005 52.1608V36.4824L15.6784 28.6432Z" fill="#e5e7eb"/>
<path d="M47.0352 28.6432L60.6131 36.4824V52.1608L47.0352 60L33.4573 52.1608V36.4824L47.0352 28.6432Z" fill="#e5e7eb"/>
<path d="M31.3567 0L44.9346 7.8392V23.5176L31.3567 31.3568L17.7788 23.5176V7.8392L31.3567 0Z" fill="#e5e7eb"/>
</svg>

        </Link>
        <div className="ml-5">
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
