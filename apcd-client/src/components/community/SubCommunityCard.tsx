// src/components/community/SubCommunityCard.tsx
import React from "react";
import Avatar from "../ui/Avatar";
import { getImageUrl } from "../../utils/image";
import { useNavigate } from "react-router-dom";
import type { SubCommunity } from "../../types/community";

interface SubCommunityCardProps {
  sub: SubCommunity;
  onClick?: () => void; // <-- rendu optionnel
}

const SubCommunityCard: React.FC<SubCommunityCardProps> = ({ sub, onClick }) => {
  const descriptionExcerpt = sub.description
    ? sub.description.slice(0, 60) + (sub.description.length > 60 ? "..." : "")
    : "Aucune description";

  const groupesText = `${sub.nbGroupes ?? 0} groupe${(sub.nbGroupes ?? 0) > 1 ? "s" : ""}`;

  const handleClick = () => {
    if (onClick) {
      onClick(); // appel de la fonction passée en props
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col p-3 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white h-36"
    >
      <div className="flex items-center mb-2">
        <Avatar
          src={sub.image ? getImageUrl(sub.image) : null}
          size={45}
          alt={`Avatar de ${sub.nom}`}
        />
        <div className="ml-3">
          <div className="font-semibold text-green-700 text-sm">{sub.nom}</div>
          <div className="text-xs text-gray-500">{groupesText}</div>
        </div>
      </div>
      <div className="text-xs text-gray-700 flex-1">{descriptionExcerpt}</div>
      <div className="text-xs text-red-600 font-medium hover:underline">Voir plus</div>
    </div>
  );
};

export default SubCommunityCard;
