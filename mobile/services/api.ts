// services/api.ts
import axios from "axios";

// ⚠️ Sem /users no final!
export const API_BASE_URL = "https://69efcfe8112e1b968e250381.mockapi.io";

console.log("[API] baseURL configurada:", API_BASE_URL);

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Log de TODA requisição que sai
api.interceptors.request.use((config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API →] ${config.method?.toUpperCase()} ${fullUrl}`);
    if (config.data) {
        console.log("[API →] body:", JSON.stringify(config.data));
    }
    return config;
});

// Log de erro detalhado
api.interceptors.response.use(
    (response) => {
        console.log(`[API ←] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.log("❌ Erro na API:", error.message);
        console.log("   URL completa tentada:",
            `${error.config?.baseURL}${error.config?.url}`);
        console.log("   Status:", error.response?.status);
        return Promise.reject(error);
    }
);