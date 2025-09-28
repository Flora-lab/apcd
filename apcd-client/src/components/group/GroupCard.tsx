// src/components/group/GroupCard.tsx
import React from "react";
import Avatar from "../ui/Avatar";

interface GroupCardProps {
  id: number;
  nom: string;
  nbMembres: number;
  image?: string | null;
  onClick: (id: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ id, nom, nbMembres, image, onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
    >
      <Avatar src={image} size={50} />
      <div className="ml-3">
        <div className="font-semibold">{nom}</div>
        <div className="text-sm text-gray-500">{nbMembres} membres</div>
      </div>
    </div>
  );
};

export default GroupCard;
