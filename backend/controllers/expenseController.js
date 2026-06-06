import { db } from "../config/database.js";

export function addExpense(req, res) {
  const userId = req.user.id;

  const {
    title,
    category,
    member,
    amount,
    payment_mode,
    note,
    date
  } = req.body;

  if (!title || !amount) {
    return res.status(400).json({
      message: "Title and amount are required"
    });
  }

  const query = `
    INSERT INTO expenses
    (
      user_id,
      title,
      category,
      member,
      amount,
      payment_mode,
      note,
      date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      title,
      category || "Other",
      member || "Self",
      Number(amount),
      payment_mode || "Cash",
      note || "",
      date || new Date().toISOString().split("T")[0]
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to add expense",
          error: error.message
        });
      }

      return res.status(201).json({
        message: "Expense added successfully",
        expenseId: this.lastID
      });
    }
  );
}

export function getExpenses(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM expenses
    WHERE user_id = ?
    ORDER BY date DESC, id DESC
  `;

  db.all(query, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch expenses",
        error: error.message
      });
    }

    return res.json(rows);
  });
}

export function deleteExpense(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `
    DELETE FROM expenses
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [id, userId], function (error) {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete expense",
        error: error.message
      });
    }

    return res.json({
      message: "Expense deleted successfully"
    });
  });
}