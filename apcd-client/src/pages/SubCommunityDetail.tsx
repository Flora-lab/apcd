// src/pages/SubCommunityDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Avatar from "../ui/Avatar";
import { FaUserPlus, FaPlus, FaCheck, FaEdit, FaTh, FaBars } from "react-icons/fa";
import { getImageUrl } from "../../utils/image";
import { useAuth } from "../../context/AuthContext";
import type { SubCommunity, Group } from "../../types/community";

interface SubCommunityDetailProps {}

const SubCommunityDetail: React.FC<SubCommunityDetailProps> = () => {
  const { communityId, subId } = useParams<{ communityId: string; subId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subCommunity, setSubCommunity] = useState<SubCommunity | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [modalAvatarFile, setModalAvatarFile] = useState<File | null>(null);
  const [modalAvatarPreview, setModalAvatarPreview] = useState<string | null>(null);

  const [showLightbox, setShowLightbox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  // 🔹 Chargement sous-communauté
  useEffect(() => {
    api
      .get(`/communautes/${communityId}/sub/${subId}`)
      .then((res) => {
        const data = res.data;
        const userId = data.currentUserId;

        const membres = data.membres ?? [];
        setIsMember(membres.some((m: any) => m.id === userId));
        setIsAdmin(data.created_by === userId);

        setSubCommunity({
          ...data,
          nbMembres: membres.length,
        });

        if (data.image) setModalAvatarPreview(getImageUrl(data.image));
      })
      .catch(console.error);
  }, [communityId, subId]);

  if (!subCommunity) return <div>Chargement...</div>;

  /** --- Avatar modal --- */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModalAvatarFile(e.target.files[0]);
      setModalAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  /** --- Sauvegarde sous-communauté --- */
  const saveSubCommunityChanges = async () => {
    if (!subCommunity) return;
    try {
      const updated = { ...subCommunity };
      if (newName && newName !== subCommunity.nom) {
        await api.put(`/communautes/${communityId}/sub/${subCommunity.id}`, { nom: newName });
        updated.nom = newName;
      }
      if (modalAvatarFile) {
        const formData = new FormData();
        formData.append("image", modalAvatarFile);
        const res = await api.post(`/communautes/${communityId}/sub/${subCommunity.id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updated.image = res.data.image;
        setModalAvatarPreview(getImageUrl(res.data.image));
      }
      setSubCommunity(updated);
      setModalAvatarFile(null);
      setShowModal(false);
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  /** --- Clique sur un groupe pour aller à l'espace de discussion --- */
  const handleGroupClick = (group: Group) => {
    navigate(`/groupes/${group.id}/discussion`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* --- Colonne gauche : liste des groupes --- */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Groupes</h2>
        {subCommunity.groupes?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subCommunity.groupes.map((group: Group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group)}
                className="p-4 border rounded-md shadow-sm hover:shadow-md cursor-pointer bg-white"
              >
                <div className="font-semibold text-green-700">{group.nom}</div>
                <div className="text-sm text-gray-500">{group.nbMembres} membre{group.nbMembres > 1 ? "s" : ""}</div>
                <div className="text-sm text-gray-700">{group.description?.slice(0, 80)}{group.description && group.description.length > 80 ? "..." : ""}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun groupe pour cette sous-communauté</p>
        )}
      </div>

      {/* --- Colonne droite : informations sous-communauté --- */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
        <div className="relative mx-auto w-40 h-40 cursor-pointer" onClick={() => setShowLightbox(true)}>
          <Avatar src={getImageUrl(subCommunity.image) ?? "/default-avatar.png"} size={160} alt="Avatar sous-communauté" />
        </div>
        {showLightbox && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setShowLightbox(false)}>
            <img src={getImageUrl(subCommunity.image) ?? "/default-avatar.png"} alt="Avatar sous-communauté" className="max-h-[90%] max-w-[90%] rounded-xl" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mt-2">{subCommunity.nom}</h1>
        <p className="text-gray-500 mt-1">
          {subCommunity.nbMembres} membre{subCommunity.nbMembres > 1 ? "s" : ""}
        </p>

        {/* Actions, description et modals peuvent être ajoutés ici comme dans CommunityDetail */}
      </div>
    </div>
  );
};

export default SubCommunityDetail;
