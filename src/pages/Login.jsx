import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    //AQUÍ VA LA API DESPUÉS
    console.log("ENVIAR A API:", { email, password });

    //Con esto redirigimos:
    navigate("/tiquetes");

  }
  return (
    <div className="w-full h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-80 text-center">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="text-sm">User</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="text-left">
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full border rounded-md p-2 mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-gray-200 hover:bg-gray-300 rounded-md py-2 mt-2">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
