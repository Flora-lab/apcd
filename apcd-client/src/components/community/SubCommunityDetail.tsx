// src/components/community/SubCommunityDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Avatar from "../ui/Avatar";
import { FaUserPlus, FaPlus, FaCheck, FaEdit, FaTh, FaBars } from "react-icons/fa";
import { getImageUrl } from "../../utils/image";
import { useAuth } from "../../context/AuthContext";
import type { SubCommunity, Group } from "../../types/community";
import GroupeCard from "./GroupCard";

const SubCommunityDetail: React.FC = () => {
  const { id: communityId, subId } = useParams<{ id: string; subId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subCommunity, setSubCommunity] = useState<SubCommunity | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [descriptionEdit, setDescriptionEdit] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const [modalAvatarPreview, setModalAvatarPreview] = useState<string | null>(null);
  const [modalAvatarFile, setModalAvatarFile] = useState<File | null>(null);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const [showLightbox, setShowLightbox] = useState(false);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberInput, setNewMemberInput] = useState("");

  useEffect(() => {
    if (!subId) return;

    api
      .get(`/subcommunautes/${subId}`)
      .then((res) => {
        const data = res.data as any;
        setSubCommunity(data);
        setIsMember(Boolean(data.isMember));
        setIsAdmin(Boolean(data.isAdmin));
        if (data.image) setModalAvatarPreview(getImageUrl(data.image));
      })
      .catch(console.error);
  }, [subId]);

  if (!subCommunity) return <div>Chargement...</div>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModalAvatarFile(e.target.files[0]);
      setModalAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const saveSubCommunityChanges = async () => {
    if (!subCommunity) return;
    try {
      const updated = { ...subCommunity };

      if (newName && newName !== subCommunity.nom) {
        await api.put(`/subcommunautes/${subCommunity.id}`, { nom: newName });
        updated.nom = newName;
      }

      if (modalAvatarFile) {
        const formData = new FormData();
        formData.append("image", modalAvatarFile);
        const res = await api.post(`/subcommunautes/${subCommunity.id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updated.image = res.data.image;
        setModalAvatarPreview(getImageUrl(res.data.image));
      }

      setSubCommunity(updated);
      setShowModal(false);
      setModalAvatarFile(null);
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return alert("Nom du groupe requis");
    try {
      const res = await api.post("/groupes", {
        nom: newGroupName,
        sub_communautes_id: subCommunity.id,
      });
      setSubCommunity({
        ...subCommunity,
        groupes: [...(subCommunity.groupes ?? []), res.data],
      });
      setNewGroupName("");
      setShowGroupModal(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du groupe");
    }
  };

  const handleJoin = async () => {
    try {
      await api.post(`/subcommunautes/${subCommunity.id}/join`);
      setIsMember(true);
      setSubCommunity((prev) =>
        prev ? { ...prev, nbMembres: (prev.nbMembres ?? 0) + 1 } : prev
      );
    } catch (err) {
      console.error(err);
      alert("Impossible de rejoindre la sous-communauté");
    }
  };

  const handleLeave = async () => {
    try {
      await api.post(`/subcommunautes/${subCommunity.id}/leave`);
      setIsMember(false);
      setSubCommunity((prev) =>
        prev ? { ...prev, nbMembres: Math.max((prev.nbMembres ?? 1) - 1, 0) } : prev
      );
    } catch (err) {
      console.error(err);
      alert("Impossible de quitter la sous-communauté");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberInput.trim()) return alert("Indique un email ou un ID utilisateur");
    try {
      const payload = /^\d+$/.test(newMemberInput)
        ? { user_id: parseInt(newMemberInput, 10) }
        : { email: newMemberInput };

      await api.post(`/subcommunautes/${subCommunity.id}/members`, payload);
      setSubCommunity((prev) =>
        prev ? { ...prev, nbMembres: (prev.nbMembres ?? 0) + 1 } : prev
      );
      setShowMemberModal(false);
      setNewMemberInput("");
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Erreur lors de l'ajout du membre (vérifie la route côté backend)"
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* --- Colonne gauche : groupes --- */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Groupes</h2>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => setViewMode("list")}
              aria-label="Vue liste"
            >
              <FaBars />
            </button>
            <button
              className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => setViewMode("grid")}
              aria-label="Vue grille"
            >
              <FaTh />
            </button>
            {(isMember || isAdmin) && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md transition"
                onClick={() => setShowGroupModal(true)}
                aria-label="Créer un groupe"
                title="Créer un groupe"
              >
                <FaPlus />
              </button>
            )}
          </div>
        </div>

        {subCommunity.groupes?.length ? (
          <div
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}
          >
            {subCommunity.groupes.map((g: Group) => (
              <GroupeCard key={g.id} groupe={g} onClick={() => navigate(`/groupes/${g.id}`)} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun groupe</p>
        )}
      </div>

      {/* --- Colonne droite : informations --- */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="relative mx-auto w-40 h-40 cursor-pointer" onClick={() => setShowLightbox(true)}>
          <Avatar src={getImageUrl(subCommunity.image)} size={160} alt="Avatar sous-communauté" />
        </div>
        {showLightbox && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setShowLightbox(false)}>
            <Avatar src={getImageUrl(subCommunity.image)} size={240} alt="Avatar sous-communauté" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mt-2">{subCommunity.nom}</h1>
        <p className="text-gray-500 mt-1">
          <span>{subCommunity.groupes?.length || 0} groupes</span> • <span>{subCommunity.nbMembres ?? 0} membres</span>
        </p>

        {/* Actions (icônes circulaires) */}
        <div className="flex justify-center items-center gap-4 mt-2">
          {(isMember || isAdmin) && (
            <>
              {/* + Membre */}
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-md transition"
                onClick={() => setShowMemberModal(true)}
                title="Ajouter un membre"
              >
                <FaUserPlus />
              </button>
              {/* Modifier sous-communauté */}
              {isAdmin && (
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-full shadow-md transition"
                  onClick={() => {
                    setShowModal(true);
                    setNewName(subCommunity.nom);
                  }}
                  title="Modifier"
                >
                  <FaEdit />
                </button>
              )}
            </>
          )}
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-left w-full">
          {descriptionEdit ? (
            <div className="flex space-x-2">
              <input
                className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <button
                onClick={() => {
                  setSubCommunity({ ...subCommunity, description: newDescription });
                  setDescriptionEdit(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                title="Enregistrer"
              >
                <FaCheck />
              </button>
            </div>
          ) : (
            <p>
              {subCommunity.description || "Aucune description"}
              {(isMember || isAdmin) && (
                <button
                  onClick={() => {
                    setDescriptionEdit(true);
                    setNewDescription(subCommunity.description || "");
                  }}
                  className="ml-2 text-green-600 hover:underline transition"
                >
                  {subCommunity.description ? "Modifier" : "Ajouter"}
                </button>
              )}
            </p>
          )}
        </div>

        {/* Bouton bas de page : Rejoindre OU Quitter */}
        {isMember ? (
          <button
            onClick={handleLeave}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl shadow-md transition mt-4"
          >
            Quitter la sous-communauté
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl shadow-md transition mt-4"
          >
            Rejoindre la sous-communauté
          </button>
        )}
      </div>

      {/* --- Modals (avatar, groupe, membre) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Modifier la sous-communauté</h2>
            <div className="flex flex-col items-center space-y-4">
              <label htmlFor="avatar-upload" className="cursor-pointer relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-md hover:scale-105 transform transition">
                  <Avatar src={modalAvatarPreview ?? getImageUrl(subCommunity.image)} size={128} alt="Avatar sous-communauté" />
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-md">
                  <FaEdit />
                </div>
              </label>
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg"
              placeholder="Nom de la sous-communauté"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowModal(false); setModalAvatarFile(null); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition">
                Annuler
              </button>
              <button onClick={saveSubCommunityChanges} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Nouveau groupe</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nom du groupe"
              className="w-full border p-3 rounded-xl"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowGroupModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition">
                Annuler
              </button>
              <button onClick={handleAddGroup} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Ajouter un membre</h2>
            <input
              type="text"
              value={newMemberInput}
              onChange={(e) => setNewMemberInput(e.target.value)}
              placeholder="Email ou ID utilisateur"
              className="w-full border p-3 rounded-xl"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowMemberModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition">
                Annuler
              </button>
              <button onClick={handleAddMember} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCommunityDetail;
