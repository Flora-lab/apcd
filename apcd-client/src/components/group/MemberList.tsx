// src/components/group/MemberList.tsx
import React from "react";
import Avatar from "../ui/Avatar";

export interface Member {   // <-- ajout du "export"
  id: number;
  nom: string;
  role?: "admin" | "membre";
  image?: string | null;
}

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <div className="p-3 border-b bg-white">
      <h3 className="font-semibold mb-2">Membres</h3>
      {members.map((member) => (
        <div key={member.id} className="flex items-center mb-2">
          <Avatar src={member.image} size={40} />
          <div className="ml-2">
            <div>{member.nom}</div>
            {member.role && (
              <div className="text-xs text-gray-500">{member.role}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
