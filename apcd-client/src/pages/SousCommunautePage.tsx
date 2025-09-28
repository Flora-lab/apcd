import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSousCommunautes } from "../api/sousCommunaute";
import { GroupeCard } from "../components/GroupeCard";
import { Avatar } from "../components/ui/Avatar";

export const SousCommunautePage = () => {
  const { id } = useParams<{ id: string }>();
  const [sousCommunaute, setSousCommunaute] = useState<any>(null);

  useEffect(() => {
    if (id) fetchSousCommunautes(Number(id)).then(setSousCommunaute);
  }, [id]);

  if (!sousCommunaute) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-3 mb-4">
        <Avatar src={sousCommunaute.image} alt={sousCommunaute.nom} size={70} type="group" />
        <div>
          <h1 className="text-xl font-bold">{sousCommunaute.nom}</h1>
          <p className="text-sm text-gray-500">{sousCommunaute.members_count} membres</p>
        </div>
      </div>

      {/* Groupes */}
      <h2 className="text-lg font-semibold mt-4 mb-2">Groupes</h2>
      <div className="space-y-2">
        {sousCommunaute.groupes?.map((g: any) => (
          <GroupeCard
            key={g.id}
            id={g.id}
            name={g.nom}
            membersCount={g.members_count}
            image={g.image}
          />
        ))}
      </div>
    </div>
  );
};
