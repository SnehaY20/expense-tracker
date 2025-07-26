import { getAuthHeaders } from "../utils/AuthHeaders";

// Login
export const loginUser = async ({ email, password }) => {
  const response = await fetch("/api/v1/auth/login", {
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

// Register
export const registerUser = async ({ name, email, password }) => {
  const response = await fetch("/api/v1/auth/register", {
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

// profile
export const fetchProfile = async () => {
  const response = await fetch("/api/v1/auth/profile", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }
  return response.json();
};

// password
export const updatePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const response = await fetch(`/api/v1/auth/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
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

// Update name
export const updateName = async (name) => {
  const response = await fetch("/api/v1/auth/update-name", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update name");
  }
  return response.json();
};
