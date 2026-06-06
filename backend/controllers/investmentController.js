import { db } from "../config/database.js";

export function addInvestment(req, res) {
  const userId = req.user.id;

  const {
    name,
    type,
    invested_amount,
    current_value,
    monthly_sip,
    expected_return
  } = req.body;

  if (!name || !invested_amount || !current_value) {
    return res.status(400).json({
      message: "Investment name, invested amount and current value are required"
    });
  }

  const query = `
    INSERT INTO investments
    (
      user_id,
      name,
      type,
      invested_amount,
      current_value,
      monthly_sip,
      expected_return
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      name,
      type || "Other",
      Number(invested_amount),
      Number(current_value),
      Number(monthly_sip || 0),
      Number(expected_return || 0)
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to add investment",
          error: error.message
        });
      }

      return res.status(201).json({
        message: "Investment added successfully",
        investmentId: this.lastID
      });
    }
  );
}

export function getInvestments(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM investments
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.all(query, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch investments",
        error: error.message
      });
    }

    return res.json(rows);
  });
}

export function deleteInvestment(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `
    DELETE FROM investments
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [id, userId], function (error) {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete investment",
        error: error.message
      });
    }

    return res.json({
      message: "Investment deleted successfully"
    });
  });
}