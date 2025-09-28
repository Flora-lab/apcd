// src/pages/CommunautesPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import CommunityCard from "../components/community/CommunityCard";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/button";
import type { Community, SubCommunity } from "../types/community";

const CommunautesPage: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [parentCommunity, setParentCommunity] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<Community[]>("/communautes")
      .then((res) => {
        setCommunities(res.data); // ✅ l’API envoie déjà totalGroupes & nbGroupes
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    try {
      const payload = { nom: newName, parentId: parentCommunity || undefined };
      const res = await api.post<Community | SubCommunity>("/communautes", payload);

      if (parentCommunity) {
        const sub: SubCommunity = {
          id: res.data.id,
          nom: res.data.nom,
          image: res.data.image || null,
          nbMembres: res.data.nbMembres,
          description: res.data.description,
          communityId: parentCommunity,
          nbGroupes: 0, // ✅ nouvelle sous-communauté => 0 groupe au départ
        };

        setCommunities((prev) =>
          prev.map((c) =>
            c.id === parentCommunity
              ? { ...c, subCommunities: [...(c.subCommunities || []), sub] }
              : c
          )
        );
      } else {
        // ✅ nouvelle communauté => pas encore de sous-communautés ni groupes
        setCommunities((prev) => [
          ...prev,
          { ...(res.data as Community), totalGroupes: 0, subCommunities: [] },
        ]);
      }

      setNewName("");
      setParentCommunity(null);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      {/* Header */}
      <div className="p-4 bg-green-700 text-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Communautés</h1>
        <div className="rounded-full bg-yellow-400 w-8 h-8 flex items-center justify-center text-green-700">
          {user?.name?.[0] || "?"}
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}

      {/* Floating button (admin) */}
      {user?.role === "admin" && (
        <button
          onClick={() => {
            setParentCommunity(null);
            setModalOpen(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 text-white text-3xl shadow-lg flex items-center justify-center"
        >
          +
        </button>
      )}

      {/* Modal création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={parentCommunity ? "Créer une sous-communauté" : "Créer une communauté"}
      >
        <input
          type="text"
          placeholder="Nom de la communauté"
          className="w-full border p-2 rounded mb-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={handleCreate}>Créer</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CommunautesPage;
