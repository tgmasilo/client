import axios from "axios";

const baseUrl = "http://localhost:8000";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get("/api/doctors");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createAppointment = async (data) => {
  try {
    const response = await api.post("/api/appointments", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAppointments = async () => {
  try {
    const response = await api.get("/api/appointments");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const startSession = async (id) => {
  try {
    const response = await api.put(`/api/appointments/${id}/start`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const endSession = async (id) => {
  try {
    const response = await api.put(`/api/appointments/${id}/end`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const rateDoctor = async (id, rating) => {
  try {
    const response = await api.put(`/api/doctors/${id}/rate`, { rating });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
