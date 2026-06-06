import { db } from "../config/database.js";

export function addGoal(req, res) {
  const userId = req.user.id;

  const {
    name,
    type,
    target_amount,
    current_amount,
    monthly_contribution,
    target_date
  } = req.body;

  if (!name || !target_amount) {
    return res.status(400).json({
      message: "Goal name and target amount are required"
    });
  }

  const query = `
    INSERT INTO goals
    (
      user_id,
      name,
      type,
      target_amount,
      current_amount,
      monthly_contribution,
      target_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      name,
      type || "Custom Goal",
      Number(target_amount),
      Number(current_amount || 0),
      Number(monthly_contribution || 0),
      target_date || ""
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to add goal",
          error: error.message
        });
      }

      return res.status(201).json({
        message: "Goal added successfully",
        goalId: this.lastID
      });
    }
  );
}

export function getGoals(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM goals
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.all(query, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch goals",
        error: error.message
      });
    }

    return res.json(rows);
  });
}

export function deleteGoal(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `
    DELETE FROM goals
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [id, userId], function (error) {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete goal",
        error: error.message
      });
    }

    return res.json({
      message: "Goal deleted successfully"
    });
  });
}