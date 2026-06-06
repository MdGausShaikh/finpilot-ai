const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("finpilot_token", data.token);
  localStorage.setItem("finpilot_user", JSON.stringify(data.user));

  return data;
}

export function logoutUser() {
  localStorage.removeItem("finpilot_token");
  localStorage.removeItem("finpilot_user");
}

export function getToken() {
  return localStorage.getItem("finpilot_token");
}

export function getCurrentUser() {
  const user = localStorage.getItem("finpilot_user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}