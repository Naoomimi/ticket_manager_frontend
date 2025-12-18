import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tiquetes from "./pages/Tiquetes";
import Administrador from "./pages/PagAdmin";
import PerfilUsu from "./pages/PerfilUsu";
import RutaPrivada from "./auth/RutaPrivada";

//Cuando terminemos de probar todo ya ahí modificamos esto para proteger las rutas
function App() {
  return (
    <Routes>
      {/* Las rutas pública */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/tiquetes"  element={
        <Tiquetes /> }
      />

            <Route path="/admin"  element={
        <Administrador /> }
      />

            <Route path="/perfil"  element={
        <PerfilUsu /> }
      />

    </Routes>
  );
}

export default App;
