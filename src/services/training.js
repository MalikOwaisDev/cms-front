import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/training`;

export const getTrainings = (token) =>
  axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTraining = (data, token) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markTrainingComplete = (recordId, token) =>
  axios.put(
    `${API}/complete/${recordId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
