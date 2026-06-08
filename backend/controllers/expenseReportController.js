import { db } from "../config/database.js";

function runAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

function runGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

export async function getExpenseReports(req, res) {
  const userId = req.user.id;

  try {
    const dailyReport = await runAll(
      `
      SELECT 
        date,
        COALESCE(SUM(amount), 0) AS totalExpense,
        COUNT(*) AS transactionCount
      FROM expenses
      WHERE user_id = ?
      GROUP BY date
      ORDER BY date DESC
      `,
      [userId]
    );

    const monthlyReport = await runAll(
      `
      SELECT 
        substr(date, 1, 7) AS month,
        COALESCE(SUM(amount), 0) AS totalExpense,
        COUNT(*) AS transactionCount
      FROM expenses
      WHERE user_id = ?
      GROUP BY substr(date, 1, 7)
      ORDER BY month DESC
      `,
      [userId]
    );

    const categoryReport = await runAll(
      `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) AS totalExpense,
        COUNT(*) AS transactionCount
      FROM expenses
      WHERE user_id = ?
      GROUP BY category
      ORDER BY totalExpense DESC
      `,
      [userId]
    );

    const topExpenseRow = await runGet(
      `
      SELECT 
        title,
        category,
        amount,
        date
      FROM expenses
      WHERE user_id = ?
      ORDER BY amount DESC
      LIMIT 1
      `,
      [userId]
    );

    const totalExpenseRow = await runGet(
      `
      SELECT COALESCE(SUM(amount), 0) AS totalExpense
      FROM expenses
      WHERE user_id = ?
      `,
      [userId]
    );

    const totalTransactionsRow = await runGet(
      `
      SELECT COUNT(*) AS totalTransactions
      FROM expenses
      WHERE user_id = ?
      `,
      [userId]
    );

    const currentMonth = new Date().toISOString().slice(0, 7);

    const currentMonthRow = await runGet(
      `
      SELECT COALESCE(SUM(amount), 0) AS currentMonthExpense
      FROM expenses
      WHERE user_id = ?
      AND substr(date, 1, 7) = ?
      `,
      [userId, currentMonth]
    );

    return res.json({
      overview: {
        totalExpense: Number(totalExpenseRow.totalExpense || 0),
        totalTransactions: Number(totalTransactionsRow.totalTransactions || 0),
        currentMonthExpense: Number(currentMonthRow.currentMonthExpense || 0),
        topExpense: topExpenseRow || null
      },
      dailyReport,
      monthlyReport,
      categoryReport,
      aiInsight:
        "Your expense reports are generated from real expense records. Use daily and monthly trends to control spending and improve savings."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate expense reports",
      error: error.message
    });
  }
}