// src/components/group/GroupDetails.tsx
import React, { useState } from "react";
import Button from "../ui/button"; // correction : "Boutton" -> "Button"
import Avatar from "../ui/Avatar";
import MemberList from "./MemberList";
import MediaGallery from "./MediaGallery";
import type { Member } from "./MemberList";
import Modal from "../ui/Modal";

interface GroupDetailsProps {
  nom: string;
  nbMembres: number;
  description?: string;
  image?: string | null;
  members: Member[]; // <-- on réutilise le type existant
  medias: { id: number; type: "image" | "video"; url: string }[];
  onAddMember: (userId: number) => void;
  onQuitGroup: () => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
  nom,
  nbMembres,
  description,
  image,
  members,
  medias,
  onAddMember,
  onQuitGroup,
}) => {
  const [isDescModalOpen, setDescModalOpen] = useState(false);

  return (
    <div className="p-3 space-y-4 bg-white">
      <div className="flex items-center space-x-3">
        <Avatar src={image} size={60} />
        <div>
          <div className="font-semibold text-lg">{nom}</div>
          <div className="text-sm text-gray-500">{nbMembres} membres</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Description</span>
          <Button variant="icon" onClick={() => setDescModalOpen(true)}>
            ✏️
          </Button>
        </div>
        <p className="mt-1 text-gray-700">{description || "Pas de description"}</p>
      </div>

      <MemberList members={members} />

      <div className="flex space-x-2">
        <Button onClick={() => onAddMember(0)}>➕ Ajouter membre</Button>
        <Button variant="danger" onClick={onQuitGroup}>
          Quitter le groupe
        </Button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Médias</h3>
        <MediaGallery medias={medias} />
      </div>

      {/* Modal pour modifier description */}
      <Modal isOpen={isDescModalOpen} onClose={() => setDescModalOpen(false)} title="Modifier la description">
        <textarea
          className="w-full border p-2 rounded"
          defaultValue={description || ""}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={() => setDescModalOpen(false)}>Sauvegarder</Button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupDetails;
