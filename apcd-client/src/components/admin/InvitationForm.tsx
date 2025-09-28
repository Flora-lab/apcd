import { useState } from "react";
import axios from "axios";
import { FiCopy } from "react-icons/fi";

const InvitationForm = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("auth_token"); // Récupère le token stocké

  const generateCode = () => {
    const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    setCode(newCode);
    setMessage("");
  };

  const saveCode = async () => {
    if (!code) return;
    if (!token) {
      setMessage("Tu n'es pas connectée !");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/admin/invitation/generate",
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Code enregistré en base !");
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Erreur lors de l'enregistrement."
      );
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setMessage("Code copié !");
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Générer un code d’invitation</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={code}
          readOnly
          placeholder="Code généré"
          className="flex-1 border px-3 py-2 rounded text-center font-mono text-lg bg-gray-100"
        />
        {code && (
          <button
            onClick={copyCode}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-600"
            title="Copier le code"
          >
            <FiCopy size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={generateCode}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
        >
          Générer
        </button>

        {code && (
          <button
            onClick={saveCode}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
          >
            Enregistrer
          </button>
        )}
      </div>

      {message && (
        <p className="mt-3 text-sm text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
};

export default InvitationForm;
