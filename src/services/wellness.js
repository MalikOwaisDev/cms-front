import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/wellness`;

export const createCarePlan = (data, token) =>
  axios.post(`${API}/care-plan`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCarePlans = (token) =>
  axios.get(`${API}/care-plan`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateGoalStatus = (data, token) =>
  axios.put(`${API}/care-plan/goal`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createResource = (data, token) =>
  axios.post(`${API}/resources`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getResources = (token) =>
  axios.get(`${API}/resources`, {
    headers: { Authorization: `Bearer ${token}` },
  });
