import { api } from "./axios";

export const fetchSousCommunautes = async (communauteId: number) => {
  const { data } = await api.get(`/communautes/${communauteId}/sous-communautes`);
  return data;
};
