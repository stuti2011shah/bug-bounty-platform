import { api } from "./client.js";

export async function getBugs() {
  const { data } = await api.get("/bugs");
  return data;
}

export async function getBugById(id) {
  const { data } = await api.get(`/bugs/${id}`);
  return data;
}

export async function createBug({ title, description, bountyAmount }) {
  const { data } = await api.post("/bugs", {
    title,
    description,
    bountyAmount: Number(bountyAmount),
  });
  return data;
}
