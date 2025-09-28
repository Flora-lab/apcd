// src/pages/CommunityDetail.tsx
import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { api } from "../../api/axios";
import Avatar from "../ui/Avatar";
import { useParams, useNavigate} from "react-router-dom";
import { FaUserPlus, FaPlus, FaCheck, FaEdit, FaTh, FaBars } from "react-icons/fa";
import { getImageUrl } from "../../utils/image";
import { useAuth } from "../../context/AuthContext";
import type { Community, SubCommunity } from "../../types/community";
import SubCommunityCard from "./SubCommunityCard"; // <-- nouveau

const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(false);
  const { user } = useAuth();
  const [newDescription, setNewDescription] = useState("");

  const [showSubModal, setShowSubModal] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");
  const [newSubCategorie, setNewSubCategorie] = useState("");
  const [newSubImage, setNewSubImage] = useState<File | null>(null);
  const [newSubPreview, setNewSubPreview] = useState<string | null>(null);

  const [showLightbox, setShowLightbox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const [modalAvatarPreview, setModalAvatarPreview] = useState<string | null>(null);
  const [modalAvatarFile, setModalAvatarFile] = useState<File | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    api
      .get(`/communautes/${id}`)
      .then((res) => {
        const data = res.data;
        const userId = data.currentUserId;

        let membres = data.membres ?? [];
        const creatorExists = membres.some((m: any) => m.id?.toString() === data.created_by?.toString());
        if (!creatorExists && data.created_by) {
          membres.push({ id: data.created_by });
        }

        data.membres = membres;
        data.nbMembres = membres.length;

        if (data.subCommunities) {
          data.subCommunities = data.subCommunities.map((sub: any) => {
            let subMembres = sub.membres ?? [];
            if (!subMembres.some((m: any) => m.id === sub.created_by)) {
              subMembres.push({ id: sub.created_by });
            }
            return {
              ...sub,
              membres: subMembres,
              nbMembres: subMembres.length,
            };
          });
        }

        setCommunity(data);
        setIsMember(membres.some((m: any) => m.id === userId));
        setIsAdmin(data.created_by === userId);

        if (data.image) setModalAvatarPreview(getImageUrl(data.image));
      })
      .catch(console.error);
  }, [id]);

  if (!community) return <div>Chargement...</div>;

  /** --- Avatar modal --- */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModalAvatarFile(e.target.files[0]);
      setModalAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  /** --- Sauvegarde modifications communauté --- */
  const saveCommunityChanges = async () => {
    try {
      let updatedCommunity = { ...community };

      if (newName && newName !== community.nom) {
        await api.put(`/communautes/${community.id}`, { nom: newName });
        updatedCommunity.nom = newName;
      }

      if (modalAvatarFile) {
        const formData = new FormData();
        formData.append("image", modalAvatarFile);

        const res = await api.post(`/communautes/${community.id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedCommunity.image = res.data.image;
        setModalAvatarPreview(getImageUrl(res.data.image));
      }

      setCommunity(updatedCommunity);
      setModalAvatarFile(null);
      setShowModal(false);
    } catch (err: any) {
      alert(`Erreur lors de la sauvegarde : ${err.message}`);
      console.error(err);
    }
  };

  /** --- Membership --- */
  const handleJoin = async () => {
    try {
      await api.post(`/communautes/${community.id}/join`);
      setIsMember(true);

      setCommunity((prev) =>
        prev ? { ...prev, nbMembres: (prev.nbMembres ?? 0) + 1 } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    try {
      await api.post(`/communautes/${community.id}/leave`);
      setIsMember(false);

      setCommunity((prev) =>
        prev ? { ...prev, nbMembres: Math.max((prev.nbMembres ?? 1) - 1, 0) } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  /** --- Gestion création sous-communauté --- */
  const handleNewSubImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewSubImage(e.target.files[0]);
      setNewSubPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

const handleAddSub = async () => {
  if (!newSubName.trim()) {
    alert("Le nom de la sous-communauté est obligatoire");
    return;
  }

  if (!user) {
    alert("Vous devez être connecté pour créer une sous-communauté");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("nom", newSubName);
    formData.append("description", newSubDescription || "");
    formData.append("categorie", newSubCategorie || "");
    formData.append("communaute_id", community!.id.toString()); // <-- ajouter l'id de la communauté

    if (newSubImage) {
      formData.append("image", newSubImage);
    }

    // POST vers la nouvelle route des sous-communautés
    const res = await api.post("/subcommunautes", formData, { withCredentials: true });

    const newSub: SubCommunity = {
      ...res.data,
      membres: [{ id: user.id, nom: user.name }],
      nbMembres: 1,
    };

    setCommunity({
      ...community!,
      subCommunities: [...(community!.subCommunities ?? []), newSub],
    });

    // Réinitialiser le formulaire
    setNewSubName("");
    setNewSubDescription("");
    setNewSubCategorie("");
    setNewSubImage(null);
    setNewSubPreview(null);
    setShowSubModal(false);

  } catch (err: any) {
    console.error(err);
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      const messages = Object.values(errors).flat().join("\n");
      alert("Erreur de validation :\n" + messages);
    } else if (err.response?.status === 401) {
      alert("Vous n'êtes pas autorisé. Veuillez vous reconnecter.");
    } else {
      alert("Erreur lors de l'ajout de la sous-communauté");
    }
  }
};



  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* --- Colonne gauche : sous-communautés --- */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Sous-communautés</h2>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => setViewMode("list")}
            >
              <FaBars />
            </button>
            <button
              className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => setViewMode("grid")}
            >
              <FaTh />
            </button>
          </div>
        </div>

        {community.subCommunities?.length ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
            {community.subCommunities.map((sub: SubCommunity) => (
              <SubCommunityCard
              key={sub.id}
              sub={sub}
              onClick={() => navigate(`/subcommunautes/${sub.id}`)} // <-- navigation
            />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune sous-communauté</p>
        )}
      </div>

      {/* --- Colonne droite : informations communauté --- */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div
          className="relative mx-auto w-40 h-40 cursor-pointer"
          onClick={() => setShowLightbox(true)}
        >
          <Avatar
            src={getImageUrl(community.image)}
            size={160}
            alt="Avatar communauté"
          />
        </div>
        {/* Lightbox */}
        {showLightbox && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={() => setShowLightbox(false)}
          >
            <Avatar
              src={getImageUrl(community.image)}
              size={240}
              alt="Avatar communauté"
            />
          </div>
        )}
        {/* Nom et membres */}
        <h1 className="text-2xl font-bold text-gray-800 mt-2">{community.nom}</h1>
        <p className="text-gray-500 mt-1">
          <span>{community.totalGroupes} groupes</span>
        </p>

        {/* Actions */}
        <div className="flex justify-center items-center gap-4 mt-2">
          {(isMember || isAdmin) ? (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md transition"
                onClick={() => { if (!user) { alert("Vous devez être connecté"); return; } setShowSubModal(true); }}
              >
                <FaPlus />
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-md transition">
                <FaUserPlus />
              </button>
              {isAdmin && (
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-full shadow-md transition"
                  onClick={() => { setShowModal(true); setNewName(community.nom); }}
                >
                  <FaEdit />
                </button>
              )}
            </>
          ) : (
            <button onClick={handleJoin} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition">
              Rejoindre
            </button>
          )}
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-left">
          {descriptionEdit ? (
            <div className="flex space-x-2">
              <input
                className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <button
                onClick={() => { setCommunity({ ...community, description: newDescription }); setDescriptionEdit(false); }}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
              >
                <FaCheck />
              </button>
            </div>
          ) : (
            <p>
              {community.description || "Aucune description"}
              {(isMember || isAdmin) && (
                <button
                  onClick={() => { setDescriptionEdit(true); setNewDescription(community.description || ""); }}
                  className="ml-2 text-green-600 hover:underline transition"
                >
                  {community.description ? "Modifier" : "Ajouter"}
                </button>
              )}
            </p>
          )}
        </div>

        {/* Quitter */}
        {(isMember || isAdmin) && (
          <button
            onClick={handleLeave}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl shadow-md transition mt-4"
          >
            Quitter la communauté
          </button>
        )}
      </div>

      {/* --- Modal création sous-communauté --- */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96 space-y-6 shadow-lg transform transition-all scale-105">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Nouvelle sous-communauté</h2>

            <div className="flex flex-col items-center space-y-2">
              <label htmlFor="sub-avatar-upload" className="cursor-pointer">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-green-500 shadow-md hover:scale-105 transform transition">
                  <img
                    src={newSubPreview ?? "/default-avatar.png"}
                    alt="Avatar sous-communauté"
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>
              <input type="file" id="sub-avatar-upload" className="hidden" accept="image/*" onChange={handleNewSubImage} />
            </div>

            <input type="text" placeholder="Nom *" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="border p-3 rounded w-full" />
            <textarea placeholder="Description" value={newSubDescription} onChange={(e) => setNewSubDescription(e.target.value)} className="border p-3 rounded w-full" />
            <input type="text" placeholder="Catégorie" value={newSubCategorie} onChange={(e) => setNewSubCategorie(e.target.value)} className="border p-3 rounded w-full" />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowSubModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition">Annuler</button>
              <button onClick={handleAddSub} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition">Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal modification communauté --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Modifier la communauté</h2>

            <div className="flex flex-col items-center space-y-4">
              <label htmlFor="avatar-upload" className="cursor-pointer relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-md hover:scale-105 transform transition">
                  <Avatar
                    src={modalAvatarPreview ?? getImageUrl(community.image)}
                    size={128}
                    alt="Avatar communauté"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-md">
                  <FaEdit />
                </div>
              </label>
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg" placeholder="Nom de la communauté" />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowModal(false); setModalAvatarFile(null); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition">Annuler</button>
              <button onClick={saveCommunityChanges} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetail;
