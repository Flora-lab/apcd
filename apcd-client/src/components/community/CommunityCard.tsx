// src/components/community/CommunityCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { getImageUrl } from "../../utils/image";
import type { Community, SubCommunity } from "../../types/community";

interface CommunityCardProps {
  community: Community | SubCommunity;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const navigate = useNavigate();

  const descriptionExcerpt =
    "description" in community && community.description
      ? community.description.slice(0, 60) + (community.description.length > 60 ? "..." : "")
      : "Aucune description";

  // ✅ afficher groupes différemment selon type
  const groupesText =
    "communityId" in community
      ? `${community.nbGroupes ?? 0} groupe${(community.nbGroupes ?? 0) > 1 ? "s" : ""}`
      : `${(community as Community).totalGroupes ?? 0} groupe${
          (community as Community).totalGroupes > 1 ? "s" : ""
        }`;

  return (
    <div
      onClick={() =>
        "communityId" in community
          ? navigate(`/communautes/${community.communityId}/sub/${community.id}`)
          : navigate(`/communautes/${community.id}`)
      }
      className="flex flex-col p-3 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white h-36"
    >
      <div className="flex items-center mb-2">
        <Avatar
          src={community.image ? getImageUrl(community.image) : null}
          size={45}
          alt={`Avatar de ${community.nom}`}
        />
        <div className="ml-3">
          <div className="font-semibold text-green-700 text-sm">{community.nom}</div>
          <div className="text-xs text-gray-500">{groupesText}</div>
        </div>
      </div>
      <div className="text-xs text-gray-700 flex-1">{descriptionExcerpt}</div>
      <div className="text-xs text-red-600 font-medium hover:underline">Voir plus</div>
    </div>
  );
};

export default CommunityCard;
