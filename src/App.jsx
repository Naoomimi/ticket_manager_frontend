import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tiquetes from "./pages/Tiquetes";
import Administrador from "./pages/PagAdmin";
import PerfilUsu from "./pages/PerfilUsu";
import RutaPrivada from "./auth/RutaPrivada";
import AdminUsers from "./pages/Admin"; 

function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />

      {/* Protegidas */}
      <Route
        path="/tiquetes"
        element={
          <RutaPrivada>
            <Tiquetes />
          </RutaPrivada>
        }
      />

      <Route
        path="/admin"
        element={
          <RutaPrivada>
            <Administrador />
          </RutaPrivada>
        }
      />

      
      <Route
        path="/admin/users"
        element={
          <RutaPrivada>
            <AdminUsers />
          </RutaPrivada>
        }
      />

      <Route
        path="/perfil"
        element={
          <RutaPrivada>
            <PerfilUsu />
          </RutaPrivada>
        }
      />
    </Routes>
  );
}

export default App;
