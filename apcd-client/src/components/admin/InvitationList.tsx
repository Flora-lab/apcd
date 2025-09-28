import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

interface Invitation {
  id: number;
  code: string;
  used: boolean;
  created_at: string;
  expires_at?: string | null;
  used_by?: {
    full_name: string;
  } | null;
}

export default function InvitationList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("auth_token");

  const fetchInvitations = async () => {
    if (!token) {
      setMessage("Tu n'es pas connectée !");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/admin/invitations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Calcul de l'expiration automatique 14 jours après création si non défini
      const invWithExpiry = res.data.map((inv: Invitation) => {
        if (!inv.expires_at) {
          const created = new Date(inv.created_at);
          const expires = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
          return { ...inv, expires_at: expires.toISOString() };
        }
        return inv;
      });

      setInvitations(invWithExpiry);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la récupération des codes.");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const deleteInvitation = async (id: number) => {
    if (!token) {
      setMessage("Tu n'es pas connectée !");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/admin/invitation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvitations(invitations.filter((inv) => inv.id !== id));
      setMessage("Code supprimé !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Liste des codes d’invitation</h1>
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      {invitations.length === 0 ? (
        <p>Aucun code généré pour le moment.</p>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border">Code</th>
              <th className="px-3 py-2 border">Utilisé</th>
              <th className="px-3 py-2 border">Par</th>
              <th className="px-3 py-2 border">Créé le</th>
              <th className="px-3 py-2 border">Expiration</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border font-mono">{inv.code}</td>
                <td className="px-3 py-2 border">
                  {inv.used ? (
                    <span className="text-red-600 font-semibold">Oui</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Non</span>
                  )}
                </td>
                <td className="px-3 py-2 border">
                  {inv.used_by ? inv.used_by.full_name : "—"}
                </td>
                <td className="px-3 py-2 border">
                  {new Date(inv.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2 border">
                  {inv.expires_at
                    ? new Date(inv.expires_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-3 py-2 border">
                  <button
                    onClick={() => deleteInvitation(inv.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    <FiTrash2 size={16} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
