import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth_token");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/my-invited-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du chargement des utilisateurs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: number, newRole: string) => {
    const oldUsers = [...users];
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Rôle mis à jour !", "success");
    } catch (err) {
      console.error(err);
      setUsers(oldUsers);
      showToast("Erreur lors de la modification du rôle.", "error");
    }
  };

  const deleteUser = async (id: number) => {
    const oldUsers = [...users];
    setUsers(users.filter((u) => u.id !== id));
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Utilisateur supprimé !", "success");
    } catch (err) {
      console.error(err);
      setUsers(oldUsers);
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}


    {loading ? (
        <div className="flex justify-center items-center h-48">
            <div className="w-16 h-16 rounded-full border-4 border-t-green-500 border-r-yellow-500 border-b-red-500 border-l-green-500 animate-spin"></div>
        </div>
        ) :(
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Nom</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Rôle</th>
                <th className="px-3 py-2 border">Invité le</th>
                <th className="px-3 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-2 border text-center">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{u.full_name}</td>
                    <td className="px-3 py-2 border">{u.email}</td>
                    <td className="px-3 py-2 border">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 border">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2 border text-center">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}









// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FiTrash2 } from "react-icons/fi";

// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   role: string;
//   created_at: string;
// }

// export default function UserManager() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("auth_token");

//   const showToast = (message: string, type: "success" | "error") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:8000/api/admin/my-invited-users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Forcer un minimum de 2 secondes pour le loader
//       setTimeout(() => {
//         setUsers(res.data);
//         setLoading(false);
//       }, 500); // tu peux mettre 2000 pour effet full 2s
//     } catch (err) {
//       console.error(err);
//       showToast("Erreur lors du chargement des utilisateurs.", "error");
//       setLoading(false);
//     }
//   };

//   const updateRole = async (id: number, newRole: string) => {
//     // Optimistic update pour rendre l'UI instantanée
//     const oldUsers = [...users];
//     setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
//     try {
//       await axios.put(
//         `http://localhost:8000/api/admin/users/${id}/role`,
//         { role: newRole },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("Rôle mis à jour !", "success");
//     } catch (err) {
//       console.error(err);
//       setUsers(oldUsers); // rollback si erreur
//       showToast("Erreur lors de la modification du rôle.", "error");
//     }
//   };

//   const deleteUser = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(users.filter((u) => u.id !== id));
//       showToast("Utilisateur supprimé !", "success");
//     } catch (err) {
//       console.error(err);
//       showToast("Erreur lors de la suppression.", "error");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
//             toast.type === "success" ? "bg-green-500" : "bg-red-500"
//           }`}
//         >
//           {toast.message}
//         </div>
//       )}

//     {/* {loading ? (
//     <div className="flex justify-center items-center h-48">
//         <div className="w-16 h-16 rounded-full border-4 border-t-green-500 border-r-yellow-500 border-b-red-500 border-l-green-500 animate-spin"></div>
//     </div>
//     ) : */}
//     {loading ? (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-left min-w-[600px]">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-3 py-2 border">Nom</th>
//                 <th className="px-3 py-2 border">Email</th>
//                 <th className="px-3 py-2 border">Rôle</th>
//                 <th className="px-3 py-2 border">Invité le</th>
//                 <th className="px-3 py-2 border text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[...Array(5)].map((_, i) => (
//                 <tr key={i} className="animate-pulse">
//                   <td className="px-3 py-2 border bg-gray-200 h-6 rounded">&nbsp;</td>
//                   <td className="px-3 py-2 border bg-gray-200 h-6 rounded">&nbsp;</td>
//                   <td className="px-3 py-2 border bg-gray-200 h-6 rounded">&nbsp;</td>
//                   <td className="px-3 py-2 border bg-gray-200 h-6 rounded">&nbsp;</td>
//                   <td className="px-3 py-2 border text-center">
//                     <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) :(
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-left min-w-[600px]">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-3 py-2 border">Nom</th>
//                 <th className="px-3 py-2 border">Email</th>
//                 <th className="px-3 py-2 border">Rôle</th>
//                 <th className="px-3 py-2 border">Invité le</th>
//                 <th className="px-3 py-2 border text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-3 py-2 border text-center">
//                     Aucun utilisateur trouvé.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((u) => (
//                   <tr key={u.id} className="hover:bg-gray-50">
//                     <td className="px-3 py-2 border">{u.full_name}</td>
//                     <td className="px-3 py-2 border">{u.email}</td>
//                     <td className="px-3 py-2 border">
//                       <select
//                         value={u.role}
//                         onChange={(e) => updateRole(u.id, e.target.value)}
//                         className="border px-2 py-1 rounded"
//                       >
//                         <option value="user">Utilisateur</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </td>
//                     <td className="px-3 py-2 border">
//                       {new Date(u.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-3 py-2 border text-center">
//                       <button
//                         onClick={() => deleteUser(u.id)}
//                         className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
