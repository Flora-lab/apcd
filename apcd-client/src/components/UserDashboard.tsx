// import { useEffect, useState } from "react";
// import { api } from "../api/axios";

// export default function UserDashboard() {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     api.get("/me", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` },
//     }).then((res) => setUser(res.data));
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-6">Mon espace</h1>
//       {user ? (
//         <div className="bg-white shadow p-6 rounded-lg">
//           <p><b>Nom :</b> {user.name}</p>
//           <p><b>Email :</b> {user.email}</p>
//           <p><b>Rôle :</b> {user.is_admin ? "Admin" : "Utilisateur"}</p>
//         </div>
//       ) : (
//         <p>Chargement...</p>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { FaUserCircle, FaBell, FaHome, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className={`font-bold text-lg ${sidebarOpen ? "block" : "hidden"}`}>
            Dashboard
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800"
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>
        <nav className="mt-4">
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer">
              <FaHome />
              {sidebarOpen && <span>Accueil</span>}
            </li>
            <li className="flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer">
              <FaUserCircle />
              {sidebarOpen && <span>Profil</span>}
            </li>
            <li className="flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer">
              <FaCog />
              {sidebarOpen && <span>Paramètres</span>}
            </li>
            <li className="flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer">
              <FaSignOutAlt />
              {sidebarOpen && <span>Déconnexion</span>}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800 md:hidden"
            >
              {sidebarOpen ? "«" : "»"}
            </button>
            <input
              type="text"
              placeholder="Rechercher..."
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="flex items-center gap-4">
            <FaBell className="text-xl text-gray-600 hover:text-gray-800 cursor-pointer" />
            <div className="flex items-center gap-2 cursor-pointer">
              <FaUserCircle className="text-2xl text-gray-600" />
              <span className="hidden md:block">John Doe</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card exemple */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-2">Statistiques</h2>
              <p>Exemple de contenu</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-2">Messages</h2>
              <p>Exemple de contenu</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg mb-2">Activité récente</h2>
              <p>Exemple de contenu</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

