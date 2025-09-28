import React from "react";
import type { Group } from "../../types/community";
import { getImageUrl } from "../../utils/image";
import Avatar from "../ui/Avatar";

interface Props {
  groupe: Group;
  onClick?: () => void;
}

const GroupeCard: React.FC<Props> = ({ groupe, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Avatar src={getImageUrl(groupe.image)} size={64} alt={groupe.nom} />
        <div>
          <h3 className="text-lg font-semibold">{groupe.nom}</h3>
          <p className="text-gray-500">{groupe.nbMembres} membres</p>
        </div>
      </div>
    </div>
  );
};

export default GroupeCard;
