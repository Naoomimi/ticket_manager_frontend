import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tiquetes from "./pages/Tiquetes";
import Administrador from "./pages/PagAdmin";
import Perfil from "./pages/Perfil";
import RutaPrivada from "./auth/RutaPrivada";

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
        <Perfil /> }
      />

    </Routes>
  );
}

export default App;
