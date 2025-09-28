import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // récupération de login du context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      const { user, token } = res.data;

      // Met à jour le context avec l'utilisateur et le token
      login({ user, token });

      // Redirection immédiate vers l'accueil
      navigate("/", { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-white min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Connexion</h2>

        {/* Boutons sociaux */}
        <button
          type="button"
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 mb-4 hover:bg-gray-100 transition"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continuer avec Google
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center bg-blue-600 text-white rounded-md py-2 mb-4 hover:bg-blue-700 transition"
        >
          <FaFacebookF className="w-5 h-5 mr-2" />
          Continuer avec Facebook
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400">ou</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <a href="#" className="hover:underline">Mot de passe oublié ?</a>
          <a href="/register" className="hover:underline">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
