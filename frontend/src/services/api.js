import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

export const getCandidates = async () => {
  const response = await api.get("/candidates/");
  return response.data;
};

export const createCandidate = async (candidateData) => {
  const response = await api.post("/candidates/", candidateData);
  return response.data;
};

export const getSkills = async () => {
  const response = await api.get("/skills/");
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get("/jobs/");
  return response.data;
};

export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/parse-resume/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const parseJD = async (text) => {
  const response = await api.post("/parse-jd/", { text });
  return response.data;
};

export const getGithubData = async (username) => {
  const response = await api.get(`/github/${username}`);
  return response.data;
};

export default api;
