import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // si tu utilises react-router

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // hook pour navigation

  const handleLogout = () => {
    // Supprime le token
    localStorage.removeItem("token");
    // Redirige vers la page de login
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 border rounded px-2 py-1">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="outline-none text-sm"
        />
      </div>

      {/* Icônes droite */}
      <div className="flex items-center gap-4 relative">
        <Bell size={20} className="cursor-pointer text-gray-600" />

        {/* Avatar */}
        <div className="relative">
          <User
            size={22}
            className="cursor-pointer text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Profil
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout} // ← ajoute la fonction de déconnexion
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
