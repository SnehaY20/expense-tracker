import { apiCall } from "../utils/apiClient";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error("Unexpected response: " + text.slice(0, 100));
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    if (response.status === 400 && email) {
      throw new Error("User already exists");
    } else {
      throw new Error("Registration failed");
    }
  }

  return response.json();
};

export const fetchProfile = async () => {
  const response = await apiCall("/auth/profile", {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }
  return response.json();
};

export const updatePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const response = await apiCall(`/auth/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      throw new Error("Current password is incorrect");
    }
    throw new Error(error.error || "Failed to update password");
  }
  return response.json();
};

export const updateName = async (name) => {
  const response = await apiCall("/auth/update-name", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update name");
  }
  return response.json();
};
