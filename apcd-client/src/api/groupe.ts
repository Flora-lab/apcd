import { api } from "./axios";

export const fetchGroupes = async (parentId: number, type: "communaute" | "sous-communaute") => {
  const { data } = await api.get(`/${type}s/${parentId}/groupes`);
  return data;
};

export const fetchGroupeById = async (id: number) => {
  const { data } = await api.get(`/groupes/${id}`);
  return data;
};
