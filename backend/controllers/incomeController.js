import { db } from "../config/database.js";

export function addIncome(req, res) {
  const userId = req.user.id;
  const { title, category, member, amount, note, date } = req.body;

  if (!title || !amount) {
    return res.status(400).json({
      message: "Title and amount are required"
    });
  }

  const query = `
    INSERT INTO income (user_id, title, category, member, amount, note, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      title,
      category || "Other",
      member || "Self",
      Number(amount),
      note || "",
      date || new Date().toISOString().split("T")[0]
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to add income",
          error: error.message
        });
      }

      return res.status(201).json({
        message: "Income added successfully",
        incomeId: this.lastID
      });
    }
  );
}

export function getIncome(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT * FROM income
    WHERE user_id = ?
    ORDER BY date DESC, id DESC
  `;

  db.all(query, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch income",
        error: error.message
      });
    }

    return res.json(rows);
  });
}

export function deleteIncome(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `
    DELETE FROM income
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [id, userId], function (error) {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete income",
        error: error.message
      });
    }

    return res.json({
      message: "Income deleted successfully"
    });
  });
}