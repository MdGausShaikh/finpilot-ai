import { getToken } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

/* AUTH-FREE FILE UPLOAD HEADER */
function getAuthHeaderOnly() {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`
  };
}

/* =========================
   INCOME API
========================= */

export async function fetchIncome() {
  const response = await fetch(`${API_BASE_URL}/income`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch income");
  }

  return data;
}

export async function createIncome(incomeData) {
  const response = await fetch(`${API_BASE_URL}/income`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(incomeData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add income");
  }

  return data;
}

export async function removeIncome(id) {
  const response = await fetch(`${API_BASE_URL}/income/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete income");
  }

  return data;
}

/* =========================
   EXPENSE API
========================= */

export async function fetchExpenses() {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch expenses");
  }

  return data;
}

export async function createExpense(expenseData) {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expenseData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add expense");
  }

  return data;
}

export async function removeExpense(id) {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete expense");
  }

  return data;
}

/* =========================
   DASHBOARD API
========================= */

export async function fetchDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard summary");
  }

  return data;
}

/* =========================
   GOALS API
========================= */

export async function fetchGoals() {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch goals");
  }

  return data;
}

export async function createGoal(goalData) {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(goalData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add goal");
  }

  return data;
}

export async function removeGoal(id) {
  const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete goal");
  }

  return data;
}

/* =========================
   FAMILY API
========================= */

export async function fetchFamilyMembers() {
  const response = await fetch(`${API_BASE_URL}/family`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch family members");
  }

  return data;
}

export async function createFamilyMember(memberData) {
  const response = await fetch(`${API_BASE_URL}/family`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(memberData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add family member");
  }

  return data;
}

export async function removeFamilyMember(id) {
  const response = await fetch(`${API_BASE_URL}/family/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete family member");
  }

  return data;
}

/* =========================
   INVESTMENT API
========================= */

export async function fetchInvestments() {
  const response = await fetch(`${API_BASE_URL}/investments`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch investments");
  }

  return data;
}

export async function createInvestment(investmentData) {
  const response = await fetch(`${API_BASE_URL}/investments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(investmentData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add investment");
  }

  return data;
}

export async function removeInvestment(id) {
  const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete investment");
  }

  return data;
}

/* =========================
   REPORTS API
========================= */

export async function fetchFinancialReport() {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch report");
  }

  return data;
}

/* =========================
   STATEMENT API
========================= */

export async function uploadStatement(file) {
  const formData = new FormData();
  formData.append("statement", file);

  const response = await fetch(`${API_BASE_URL}/statements/upload`, {
    method: "POST",
    headers: getAuthHeaderOnly(),
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload statement");
  }

  return data;
}

/* =========================
   NET WORTH API
========================= */

export async function fetchNetWorthSummary() {
  const response = await fetch(`${API_BASE_URL}/networth`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch net worth");
  }

  return data;
}

/* =========================
   AI CFO API
========================= */

export async function fetchAiCfoAnalysis() {
  const response = await fetch(`${API_BASE_URL}/ai-cfo`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch AI CFO report");
  }

  return data;
}

/* =========================
   EXPENSE REPORT API
========================= */

export async function fetchExpenseReports() {
  const response = await fetch(`${API_BASE_URL}/expense-reports`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch expense reports");
  }

  return data;
}