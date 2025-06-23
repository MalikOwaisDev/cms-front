import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/invoices`;

export const getInvoices = (token) =>
  axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getInvoiceById = (id, token) =>
  axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createInvoice = (data, token) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markInvoicePaid = (id, token) =>
  axios.put(
    `${API}/${id}/pay`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
