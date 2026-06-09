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

function formatMonth(month = "") {
  if (!month) return "Unknown";

  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return date.toLocaleString("en-IN", {
    month: "short",
    year: "numeric"
  });
}

function formatDateLabel(date = "") {
  if (!date) return "Unknown";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short"
  });
}

function buildInsight({ totalExpense, currentMonthExpense, topExpense, topCategory }) {
  if (!totalExpense || totalExpense === 0) {
    return "No expense data is available yet. Add expenses or upload a statement to generate spending insights.";
  }

  const topCategoryText = topCategory
    ? `${topCategory.category} is your highest spending category with ₹${Number(
        topCategory.totalExpense || 0
      ).toLocaleString("en-IN")}.`
    : "Category-wise spending is not available yet.";

  const topExpenseText = topExpense
    ? `Your highest single expense is ${topExpense.title} worth ₹${Number(
        topExpense.amount || 0
      ).toLocaleString("en-IN")}.`
    : "No top expense found.";

  return `${topCategoryText} ${topExpenseText} Your current month expense is ₹${Number(
    currentMonthExpense || 0
  ).toLocaleString(
    "en-IN"
  )}. Review high-spending categories weekly to improve your savings rate.`;
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
        COALESCE(category, 'Other') AS category,
        COALESCE(SUM(amount), 0) AS totalExpense,
        COUNT(*) AS transactionCount
      FROM expenses
      WHERE user_id = ?
      GROUP BY COALESCE(category, 'Other')
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

    const highestExpenseDay = dailyReport.reduce(
      (highest, item) =>
        Number(item.totalExpense || 0) > Number(highest.totalExpense || 0)
          ? item
          : highest,
      { totalExpense: 0 }
    );

    const topCategory = categoryReport[0] || null;

    const dailyTrend = [...dailyReport]
      .reverse()
      .map((item) => ({
        date: item.date,
        label: formatDateLabel(item.date),
        totalExpense: Number(item.totalExpense || 0),
        transactionCount: Number(item.transactionCount || 0)
      }));

    const monthlyTrend = [...monthlyReport]
      .reverse()
      .map((item) => ({
        month: item.month,
        label: formatMonth(item.month),
        totalExpense: Number(item.totalExpense || 0),
        transactionCount: Number(item.transactionCount || 0)
      }));

    const categoryChart = categoryReport.map((item) => ({
      category: item.category || "Other",
      totalExpense: Number(item.totalExpense || 0),
      transactionCount: Number(item.transactionCount || 0)
    }));

    const topFiveCategories = categoryChart.slice(0, 5);

    const totalExpense = Number(totalExpenseRow.totalExpense || 0);
    const currentMonthExpense = Number(
      currentMonthRow.currentMonthExpense || 0
    );

    return res.json({
      overview: {
        totalExpense,
        totalTransactions: Number(totalTransactionsRow.totalTransactions || 0),
        currentMonthExpense,
        topExpense: topExpenseRow || null,
        highestExpenseDay,
        topCategory
      },
      dailyReport,
      monthlyReport,
      categoryReport,
      charts: {
        dailyTrend,
        monthlyTrend,
        categoryChart,
        topFiveCategories
      },
      aiInsight: buildInsight({
        totalExpense,
        currentMonthExpense,
        topExpense: topExpenseRow,
        topCategory
      })
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate expense reports",
      error: error.message
    });
  }
}