// src/types/community.ts

export interface Group {
  id: number;
  nom: string;
  image?: string | null;
  description?: string;
  communaute_id: number; // correspond au backend
  created_by: number;
  nbMembres: number; // ajouté pour correspondre au backend
}

export interface SubCommunity {
  id: number;
  nom: string;
  image?: string | null;
  nbMembres: number;
  description?: string;
  parentId: number; // correspond à ton backend
  nbGroupes: number;
  groupes?: Group[]; // facultatif, peut être absent
}

export interface Community {
  id: number;
  nom: string;
  image?: string | null;
  nbMembres: number;
  description?: string;
  categorie?: string;
  parentId?: number | null; // null si communauté racine
  created_by: number;
  groupes?: Group[]; // facultatif
  groupesCount?: number; // facultatif
  subCommunities?: SubCommunity[]; // facultatif

  // total = groupes directs + ceux des sous-communautés
  totalGroupes: number;
}
