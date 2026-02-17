import { api } from "./client.js";

export async function getSubmissionsForBug(bugId) {
  const { data } = await api.get(`/bugs/${bugId}/submissions`);
  return data;
}

export async function createSubmission(bugId, { fixDescription, proofLinks = [], proofFiles = [] }) {
  const hasFiles = proofFiles?.length > 0;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("fixDescription", fixDescription);
    if (proofLinks?.length) formData.append("proofLinks", proofLinks.join("\n"));
    for (const file of proofFiles) {
      formData.append("proofFiles", file);
    }
    const { data } = await api.post(`/bugs/${bugId}/submissions`, formData);
    return data;
  }

  const { data } = await api.post(`/bugs/${bugId}/submissions`, {
    fixDescription,
    proofLinks: Array.isArray(proofLinks) ? proofLinks : proofLinks ? [proofLinks] : [],
  });
  return data;
}

export async function approveSubmission(bugId, submissionId) {
  const { data } = await api.post(`/bugs/${bugId}/submissions/${submissionId}/approve`);
  return data;
}
