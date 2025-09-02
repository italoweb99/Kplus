
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
const App = () => {
  return(
<Router>
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
</Routes>
</Router>
  );
}
export default App;
