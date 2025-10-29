import axios from "axios";
import { IP, PORT } from "@env";

const api = axios.create({
  baseURL: `http://3.141.23.81:5000`,
  timeout: 15000,
});

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.response?.data || error.message);
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadProfileImage = async (formData, token) => {
  try {
    const response = await api.post("/auth/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar imagem de perfil:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserProfile = async (userId, token) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData, token) => {
  try {
    const response = await api.put(`/users/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserImage = async (formData, token) => {
  try {
    const response = await api.put("/users/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar imagem do usuário:", error.response?.data || error.message);
    throw error;
  }
};

export const selectUserFarm = async (farmId, token) => {
  try {
    const response = await api.post("/users/select-farm", { farmId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao selecionar fazenda:", error.response?.data || error.message);
    throw error;
  }
};

export const createFarm = async (farmData, token) => {
  try {
    const response = await api.post("/farms", farmData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar fazenda:", error.response?.data || error.message);
    throw error;
  }
};

export const getFarms = async (token) => {
  try {
    const response = await api.get("/farms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fazendas:", error.response?.data || error.message);
    throw error;
  }
};

export const getFarmById = async (id, token) => {
  try {
    const response = await api.get(`/farms/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fazenda:", error.response?.data || error.message);
    throw error;
  }
};

export const updateFarm = async (id, data, token) => {
  try {
    const response = await api.put(`/farms/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar fazenda:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteFarm = async (id, token) => {
  try {
    const response = await api.delete(`/farms/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 204;
  } catch (error) {
    console.error("Erro ao deletar fazenda:", error.response?.data || error.message);
    throw error;
  }
};

export const createOccurrence = async (occData, token) => {
  try {
    const response = await api.post("/occurrences", occData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error.response?.data || error.message);
    throw error;
  }
};

export const getOccurrenceHistory = async (farmId, token) => {
  try {
    const response = await api.get("/occurrences/history", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico de ocorrências:", error.response?.data || error.message);
    throw error;
  }
};

export const getStatsByAge = async (farmId, token) => {
  try {
    const response = await api.get("/occurrences/stats/age", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas por idade:", error.response?.data || error.message);
    throw error;
  }
};

export const getStatsByDate = async (farmId, token) => {
  try {
    const response = await api.get("/occurrences/stats/date", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas por data:", error.response?.data || error.message);
    throw error;
  }
};

export const upsertSectorStats = async (statsData, token) => {
  try {
    const response = await api.post("/sector-stats", statsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar estatísticas de setor:", error.response?.data || error.message);
    throw error;
  }
};

export const getFAQs = async () => {
  try {
    const response = await api.get("/faq");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar FAQs:", error.response?.data || error.message);
    throw error;
  }
};

export const askFAQ = async (question) => {
  try {
    const response = await api.post("/faq/ask", { question });
    return response.data;
  } catch (error) {
    console.error("Erro ao perguntar FAQ:", error.response?.data || error.message);
    throw error;
  }
};

export const createFAQ = async (faqData, token) => {
  try {
    const response = await api.post("/faq", faqData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar FAQ:", error.response?.data || error.message);
    throw error;
  }
};

export const createAnalyses = async (analysesData, token) => {
  try {
    const response = await api.post("/analysis", analysesData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar análises:", error.response?.data || error.message);
    throw error;
  }
};

export const getDashboard = async (params, token) => {
  try {
    const response = await api.get("/analysis/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
