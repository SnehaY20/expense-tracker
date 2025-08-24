import { apiCall, fetchProfile } from "../utils/apiClient";

const API_BASE = '/api/v1';

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE}/auth/login`, {

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
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE}/auth/register`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error("Unexpected response: " + text.slice(0, 100));
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const data = await response.json();
  return data;
};

export { fetchProfile };

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
