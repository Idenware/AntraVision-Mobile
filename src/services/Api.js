import axios from "axios";

const api = axios.create({
  baseURL: `http://3.14.9.128:3000`,
  timeout: 15000,
});

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao registrar usuário:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao fazer login:",
      error.response?.data || error.message
    );
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
    console.error(
      "Erro ao enviar imagem de perfil:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserProfile = async (userId, token) => {
  try {
    const response = await api.get(`/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar perfil:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData, token) => {
  try {
    const response = await api.put(`/users/profile/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar perfil:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserImage = async (formData, token) => {
  try {
    const response = await api.patch("/users/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar imagem do usuário:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const selectUserFarm = async (farmId, token) => {
  try {
    const response = await api.patch(
      "/users/select-farm",
      { farmId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao selecionar fazenda:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createFarm = async (farmData, token) => {
  try {
    const response = await api.post("/farms/create", farmData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar fazenda:",
      error.response?.data || error.message
    );
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
    console.error(
      "Erro ao buscar fazendas:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFarmById = async (id, token) => {
  try {
    const response = await api.get(`/farms/farm/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar fazenda:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateFarm = async (id, data, token) => {
  try {
    const response = await api.put(`/farms/farm/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar fazenda:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteFarm = async (id, token) => {
  try {
    const response = await api.delete(`/farms/farm/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 204;
  } catch (error) {
    console.error(
      "Erro ao deletar fazenda:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOccurrence = async (occData, token) => {
  try {
    const response = await api.post("/occurrence/add", occData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar ocorrência:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOccurrenceHistory = async (farmId, token) => {
  try {
    const response = await api.get("/occurrence/history", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar histórico de ocorrências:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getStatsByAge = async (farmId, token) => {
  try {
    const response = await api.get("/occurrence/by-age", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar estatísticas por idade:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getStatsByDate = async (farmId, token) => {
  try {
    const response = await api.get("/occurrence/by-date", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar estatísticas por data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getOccurrenceSummary = async (farmId, token) => {
  try {
    const response = await api.get("/occurrence/summary", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar resumo de ocorrências:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const upsertSectorStats = async (statsData, token) => {
  try {
    const response = await api.post("/sector-stats/sector", statsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar estatísticas de setor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSectorStatsByFarm = async (farmId, token) => {
  try {
    const response = await api.get(`/sector-stats/sectors/${farmId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar estatísticas de setor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFAQs = async (token) => {
  try {
    const response = await api.get("/faq/faqs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar FAQs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const askFAQ = async (question, token) => {
  try {
    const response = await api.post(
      "/faq/ask",
      { question },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao perguntar FAQ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createFAQ = async (faqData, token) => {
  try {
    const response = await api.post("/faq/create", faqData, {
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
    const response = await api.post("/analysis/add", analysesData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar análises:",
      error.response?.data || error.message
    );
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
    console.error(
      "Erro ao buscar dashboard:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getComparison = async (farms, token) => {
  try {
    const response = await api.post(
      "/analysis/compare",
      { farms },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao comparar fazendas:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSummary = async (farmId, token) => {
  try {
    const response = await api.get("/analysis/summary", {
      headers: { Authorization: `Bearer ${token}` },
      params: { farmId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar resumo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const analyzeImage = async (analysisData, token) => {
  try {
    const response = await api.post("/ia/analisar", analysisData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao analisar imagem:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAnalysisHistory = async (farmId, token) => {
  try {
    const response = await api.get(`/ia/historico/${farmId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar histórico de análises:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
