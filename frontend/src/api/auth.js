import { apiCall, fetchProfile } from "../utils/apiClient";

export const loginUser = async ({ email, password }) => {
  const response = await apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

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
