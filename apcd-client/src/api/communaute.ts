import { api } from "./axios";

export const fetchCommunautes = async () => {
  const { data } = await api.get("/communautes");
  return data;
};

export const fetchCommunauteById = async (id: number) => {
  const { data } = await api.get(`/communautes/${id}`);
  return data;
};
