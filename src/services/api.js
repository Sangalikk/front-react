import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        Accept: "application/json",
    }  
})

export function getErrorMessage(error) {
    if (!axios.isAxiosError(error)) {
        return "Ocorreu um erro inesperado.";
    }
    const status = error.response?.status;
    const data = error.response?.data;

    if(!status || [502, 503, 504].includes(status)) {
        return "O servidor está fora do ar. Tente novamente mais tarde.";
    }
    if (status === 422 && data?.errors) {
        return Object.values(data.errors).flat()[0];
    }

    return data?.message || "Algo deu errado. Tente novamente mais tarde. (${status})";
}
