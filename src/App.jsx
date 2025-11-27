import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tiquetes from "./pages/Tiquetes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tiquetes" element={<Tiquetes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
