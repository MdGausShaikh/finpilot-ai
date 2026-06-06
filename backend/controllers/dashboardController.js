import { db } from "../config/database.js";

function runGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function runAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

export async function getDashboardSummary(req, res) {
  const userId = req.user.id;

  try {
    const incomeRow = await runGet(
      `
      SELECT COALESCE(SUM(amount), 0) AS totalIncome
      FROM income
      WHERE user_id = ?
      `,
      [userId]
    );

    const expenseRow = await runGet(
      `
      SELECT COALESCE(SUM(amount), 0) AS totalExpenses
      FROM expenses
      WHERE user_id = ?
      `,
      [userId]
    );

    const incomeRows = await runAll(
      `
      SELECT 
        id,
        date,
        title,
        category,
        amount,
        'Income' AS type
      FROM income
      WHERE user_id = ?
      `,
      [userId]
    );

    const expenseRows = await runAll(
      `
      SELECT 
        id,
        date,
        title,
        category,
        amount,
        'Expense' AS type
      FROM expenses
      WHERE user_id = ?
      `,
      [userId]
    );

    const totalIncome = Number(incomeRow.totalIncome || 0);
    const totalExpenses = Number(expenseRow.totalExpenses || 0);
    const savings = totalIncome - totalExpenses;

    const financialHealthScore =
      totalIncome === 0
        ? 0
        : Math.max(
            0,
            Math.min(100, Math.round((savings / totalIncome) * 100 + 50))
          );

    const recentTransactions = [...incomeRows, ...expenseRows]
      .sort((a, b) => {
        const dateCompare = new Date(b.date) - new Date(a.date);

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return Number(b.id) - Number(a.id);
      })
      .slice(0, 8);

    return res.json({
      totalBalance: savings,
      totalIncome,
      totalExpenses,
      savings,
      financialHealthScore,
      transactionCount: recentTransactions.length,
      recentTransactions
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load dashboard summary",
      error: error.message
    });
  }
}