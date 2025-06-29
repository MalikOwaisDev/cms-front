import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const login = async (data) => await axios.post(`${API}/login`, data);
export const register = async (data) =>
  await axios.post(`${API}/register`, data);
export const getMe = async (token) =>
  await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
