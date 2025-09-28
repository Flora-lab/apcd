import { Link } from "react-router-dom";
import { Home, Key, Menu, Users } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true); // état pour ouverture/fermeture

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Logo + bouton toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {open && (
          <Link to="/" className="text-2xl font-bold">
            MonLogo
          </Link>
        )}
        <Menu
          size={24}
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin"
              className="flex items-center gap-2 hover:text-blue-400"
            >
              <Home size={18} />
              {open && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/generate"
              className="flex items-center gap-2 hover:text-blue-400"
            >
              <Key size={18} />
              {open && "Générer Code"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex items-center gap-2 hover:text-blue-400"
            >
              <Users size={18} />
              {open && "Utilisateurs"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
