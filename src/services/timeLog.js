import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/time-logs`;

export const getTimeLogs = (token) =>
  axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTimeLog = (data, token) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
