// src/components/group/GroupHeader.tsx
import React from "react";
import Avatar from "../ui/Avatar";
import Button from '../ui/button';

interface GroupHeaderProps {
  nom: string;
  nbMembres: number;
  image?: string | null;
  onDetailsClick: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
  nom,
  nbMembres,
  image,
  onDetailsClick,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-white">
      <div className="flex items-center">
        <Avatar src={image} size={50} />
        <div className="ml-3">
          <div className="font-semibold text-lg">{nom}</div>
          <div className="text-sm text-gray-500">{nbMembres} membres</div>
        </div>
      </div>
      <Button variant="icon" onClick={onDetailsClick}>
        ℹ️
      </Button>
    </div>
  );
};

export default GroupHeader;
