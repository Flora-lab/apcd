import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupeById } from "../api/groupe";
import { Avatar } from "../components/ui/Avatar";
import { Users, LogOut } from "lucide-react";

export const GroupePage = () => {
  const { id } = useParams<{ id: string }>();
  const [groupe, setGroupe] = useState<any>(null);

  useEffect(() => {
    if (id) fetchGroupeById(Number(id)).then(setGroupe);
  }, [id]);

  if (!groupe) return <p className="p-4">Chargement...</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header style WhatsApp */}
      <div className="flex items-center gap-3 p-3 border-b bg-white shadow">
        <Avatar src={groupe.image} alt={groupe.nom} size={50} type="group" />
        <div className="flex flex-col">
          <h1 className="font-semibold">{groupe.nom}</h1>
          <p className="text-xs text-gray-500">{groupe.members_count} membres</p>
        </div>
      </div>

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <p className="text-gray-400 text-center">Ici s'affichera la discussion du groupe...</p>
      </div>

      {/* Footer chat */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Écrire un message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Envoyer</button>
      </div>

      {/* Détails groupe */}
      <div className="p-4 border-t bg-white">
        <h2 className="text-lg font-semibold mb-2">Détails du groupe</h2>
        <p className="text-sm text-gray-600 mb-2">{groupe.description || "Aucune description"}</p>
        
        <h3 className="font-medium mt-3 mb-1 flex items-center gap-2">
          <Users size={16} /> Membres
        </h3>
        <ul className="space-y-1">
          {groupe.membres?.map((m: any) => (
            <li key={m.id} className="text-sm text-gray-700">- {m.name}</li>
          ))}
        </ul>

        {/* Quitter le groupe */}
        <button className="flex items-center gap-2 mt-4 text-red-500">
          <LogOut size={16} /> Quitter le groupe
        </button>
      </div>
    </div>
  );
};
