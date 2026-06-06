import { db } from "../config/database.js";

export function addFamilyMember(req, res) {
  const userId = req.user.id;

  const {
    name,
    role,
    income_contribution,
    expense_share
  } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Family member name is required"
    });
  }

  const query = `
    INSERT INTO family_members
    (
      user_id,
      name,
      role,
      income_contribution,
      expense_share
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      userId,
      name,
      role || "Member",
      Number(income_contribution || 0),
      Number(expense_share || 0)
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          message: "Failed to add family member",
          error: error.message
        });
      }

      return res.status(201).json({
        message: "Family member added successfully",
        memberId: this.lastID
      });
    }
  );
}

export function getFamilyMembers(req, res) {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM family_members
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.all(query, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch family members",
        error: error.message
      });
    }

    return res.json(rows);
  });
}

export function deleteFamilyMember(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const query = `
    DELETE FROM family_members
    WHERE id = ? AND user_id = ?
  `;

  db.run(query, [id, userId], function (error) {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete family member",
        error: error.message
      });
    }

    return res.json({
      message: "Family member deleted successfully"
    });
  });
}