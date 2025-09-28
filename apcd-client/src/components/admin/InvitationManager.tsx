import { useEffect, useState } from "react";
import axios from "axios";
import { FiCopy, FiTrash2 } from "react-icons/fi";

interface Invitation {
  id: number;
  code: string;
  used: boolean;
  created_at: string;
  expires_at?: string | null;
  used_by?: { full_name: string } | null;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function InvitationManager() {
  const [code, setCode] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const token = localStorage.getItem("auth_token");

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const generateCode = () => {
    const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    setCode(newCode);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    addToast("Code copié !", "success");
  };

  const saveCode = async () => {
    if (!code || !token) {
      addToast("Impossible d'enregistrer : code vide ou utilisateur non connecté.", "error");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/admin/invitation/generate",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Code enregistré !", "success");
      setCode("");
      fetchInvitations();
    } catch (err) {
      console.error(err);
      addToast("Erreur lors de l'enregistrement.", "error");
    }
  };

  const fetchInvitations = async () => {
    if (!token) {
      addToast("Tu n'es pas connectée !", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/invitations", {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      addToast("Erreur lors de la récupération des codes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvitation = async (id: number) => {
    if (!token) {
      addToast("Tu n'es pas connectée !", "error");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/admin/invitation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvitations(invitations.filter((inv) => inv.id !== id));
      addToast("Code supprimé !", "success");
    } catch (err) {
      console.error(err);
      addToast("Erreur lors de la suppression.", "error");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* Toasts */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white ${
              t.type === "success"
                ? "bg-green-500"
                : t.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Gestion des codes d’invitation</h1>

      {/* Formulaire génération */}
      <div className="p-6 bg-white rounded shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Générer un code d’invitation</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={code}
            readOnly
            placeholder="Code généré"
            className="border px-3 py-2 rounded flex-1"
          />
          {code && (
            <button
              onClick={copyCode}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <FiCopy />
            </button>
          )}
          <button
            onClick={generateCode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Générer
          </button>
          {code && (
            <button
              onClick={saveCode}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Enregistrer
            </button>
          )}
        </div>
      </div>

      {/* Liste des codes */}
      <div className="p-6 bg-white rounded shadow-md relative">
        <h2 className="text-lg font-bold mb-4">Codes générés</h2>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="w-12 h-12 border-4 border-t-green-500 border-r-yellow-500 border-b-red-500 border-l-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && invitations.length === 0 ? (
          <p>Aucun code généré pour le moment.</p>
        ) : (
          !loading && (
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
                        <FiTrash2 size={16} /> 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
