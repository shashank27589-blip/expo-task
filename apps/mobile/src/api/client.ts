import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";
let getAccessToken: () => string | null = () => null;

export const api = axios.create({
  baseURL,
  timeout: 12000
});

export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
    return error.message;
  }

  return "Something went wrong";
}
