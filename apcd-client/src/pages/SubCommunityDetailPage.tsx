// src/pages/SubCommunityDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {api} from "../api/axios";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/button";
import Modal from "../components/ui/Modal";
import GroupCard from "../components/community/GroupCard";
import type { SubCommunity, Group } from "../types/community";

const SubCommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sub, setSub] = useState<SubCommunity | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/sous-communautes/${id}`).then((res) => setSub(res.data));
    api.get(`/sous-communautes/${id}/groupes`).then((res) => setGroups(res.data));
  }, [id]);

  const handleCreate = async () => {
    try {
      const res = await api.post(`/sous-communautes/${id}/groupes`, {
        nom: newName,
      });
      setGroups((prev) => [...prev, res.data]);
      setNewName("");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!sub) return <div>Chargement...</div>;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 text-lg">←</button>
        <h1 className="text-lg font-bold">{sub.nom}</h1>
      </div>

      {/* Infos sous-communauté */}
      <div className="p-4 border-b flex items-center space-x-3">
        <Avatar src={sub.image} size={60} />
        <div>
          <div className="font-semibold">{sub.nom}</div>
          <div className="text-sm text-gray-500">{sub.nbMembres} membres</div>
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((g) => (
          <GroupCard
            key={g.id}
            group={g}
            onClick={() => navigate(`/groupes/${g.id}`)}
          />
        ))}
      </div>

      {/* Bouton flottant admin */}
      {user?.role === "admin" && (
        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white text-3xl shadow-lg flex items-center justify-center"
        >
          +
        </button>
      )}

      {/* Modal création groupe */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Créer un groupe"
      >
        <input
          type="text"
          placeholder="Nom du groupe"
          className="w-full border p-2 rounded"
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

export default SubCommunityDetailPage;
