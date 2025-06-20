// Login 
export const loginUser = async ({ email, password }) => {
  const response = await fetch("/api/v1/login", {
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

  return response.json();
};

// Register 
export const registerUser = async ({ name, email, password }) => {
  const response = await fetch("/api/v1/register", {
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
