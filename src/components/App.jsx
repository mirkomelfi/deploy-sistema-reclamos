import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { Register } from './Register/Register';
import { Login } from './Login/Login';
import {EdificioListContainer} from './EdificioListContainer/EdificioListContainer';
import UnidadListContainer from './UnidadListContainer/UnidadListContainer';
import { Home } from './Home/Home';
import { Unidad } from './Unidad/Unidad';
import AreaListContainer from './AreaListContainer/AreaListContainer';
import { Area } from './Area/Area';
import { ReclamoListContainer } from './ReclamoListContainer/ReclamoListContainer';
import { Reclamo } from './Reclamo/Reclamo';
import UsuarioListContainer from './UsuarioListContainer/UsuarioListContainer';
import { Usuario } from './Usuario/Usuario';
import { UsuarioPut } from './Usuario/UsuarioPUT';
import { ReclamoPut } from './Reclamo/ReclamoPUT';
import { EdificioPut } from './Edificio/EdificioPUT';
import { AreaPut } from './Area/AreaPUT';
import { UnidadPut } from './Unidad/UnidadPUT';
import { EdificioPost } from './Edificio/EdificioPOST';
import UserUnidadListContainer from './UserUnidadListContainer/UserUnidadListContainer';
import UserAreaListContainer from './UserAreaListContainer copy/UserAreaListContainer';
import UserReclamoListContainer from './UserReclamoListContainer/UserReclamoListContainer';
import ImagenPost from './Imagen/ImagenPOST';
import { Imagen } from './Imagen/Imagen';
import { Logout } from './Logout/Logout';

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
         <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/' element={<Home />} />
          <Route path="/usuarios" element={<UsuarioListContainer greeting="Listado de Usuarios"/>}/>
          <Route path="/edificios" element={<EdificioListContainer greeting="Listado de Edificios"/>}/>
          <Route path="/reclamos" element={<ReclamoListContainer greeting="Listado de Reclamos"/>}/>
          <Route path="/edificios/:id/unidades" element={<UnidadListContainer greeting="Listado de Unidades del Edificio seleccionado"/>}/>
          <Route path="/edificios/:id/unidades/:id" element={<Unidad />}/> 
          <Route path="/edificios/:id/areas" element={<AreaListContainer greeting="Listado de Areas Comunes del Edificio seleccionado"/>}/>
          <Route path="/edificios/:id/areas/:id" element={<Area />}/> 
          <Route path="/verReclamable/:idRec/unidad/:id" element={<Unidad fromReclamo={true} />}/> 
          <Route path="/verReclamable/:idRec/area/:id" element={<Area fromReclamo={true} />}/> 
          <Route path="/reclamos/:id" element={<Reclamo />}/> 
          <Route path="/usuarios/:dni" element={<Usuario />}/> 
          <Route path="/updateUsuario/:dni" element={<UsuarioPut />}/> 
          <Route path="/updateReclamo/:id" element={<ReclamoPut />}/>
          <Route path="/verImagenes/:id" element={<Imagen num={1} />}/> 
          <Route path="/addImage/:id" element={<ImagenPost />}/> 
          <Route path="/updateEdificio/:id" element={<EdificioPut />}/>
          <Route path="/addEdificio" element={<EdificioPost />}/>
          <Route path="/updateArea/:id" element={<AreaPut />}/>
          <Route path="/updateUnidad/:id" element={<UnidadPut />}/>
          <Route path="/usuario/current" element={<Usuario />}/> 
          <Route path="/updateUsuario" element={<UsuarioPut  fromPerfil={true}  />}/>
          <Route path="/usuario/unidades" element={<UserUnidadListContainer  fromPerfil={true}  /> }/>
          <Route path="/usuario/unidades/:id" element={<Unidad  fromPerfil={true} />}/> 
          <Route path="/usuario/areas" element={<UserAreaListContainer  fromPerfil={true} />}/>
          <Route path="/usuario/areas/:id" element={<Area fromPerfil={true}  />}/> 
          <Route path="/usuario/reclamos" element={<UserReclamoListContainer  fromPerfil={true}  />}/>
          <Route path="/usuario/reclamos/:id" element={<Reclamo  fromPerfil={true}  />}/> 

          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
        
      </BrowserRouter>

    </>

  )
}