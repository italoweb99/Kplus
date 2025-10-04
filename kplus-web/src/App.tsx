

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/Header';
import Filmes from './paginas/Filmes';
import FilmePag from './paginas/FilmePag';
import Series from './paginas/Series';
import SeriesPag from './paginas/SeriesPag';
import HomePag from './paginas/HomePag';
import Cadastro from './paginas/Cadastro';
import Login from './paginas/Login';
import Usuarios from './paginas/Usuarios';
import PlayerPag from './paginas/PlayerPag';
import TesteIa from "./paginas/TesteIa";
import SearchPage from "./paginas/SearchPage";

function AppRoutes() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/reproducao/');
  return (
    <>
      {!hideHeader && <Header />}
      <main className="bg-bgpurple">
      <div className={!hideHeader ? 'pt-24' : ''}>
        <Routes>
          <Route path="/" element={<HomePag/>}/>
          <Route path='/filmes' element={<Filmes/>}/>
          <Route path="/filmes/:id" element={<FilmePag/>}/>
          <Route path="/series" element={<Series/>}/>
          <Route path="/series/:id" element={<SeriesPag/>}/>
          <Route path='/cadastro' element={<Cadastro/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/usuarios' element={<Usuarios/>}/>
          <Route path='/reproducao/:tipo/:id' element={<PlayerPag/>}/>
          <Route path="/testeia" element={<TesteIa/>}/>
          <Route path = "/search/:query" element = {<SearchPage/>}/>
        </Routes>
      </div>
      </main>
    </>
  );
}

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
