import fs from "fs";
import { createRequire } from "module";
import { db } from "../config/database.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

function detectCategory(description = "") {
  const text = description.toLowerCase();

  if (
    text.includes("swiggy") ||
    text.includes("zomato") ||
    text.includes("restaurant") ||
    text.includes("food")
  ) {
    return "Food";
  }

  if (
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("shopping")
  ) {
    return "Shopping";
  }

  if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("fuel") ||
    text.includes("petrol")
  ) {
    return "Travel";
  }

  if (
    text.includes("electricity") ||
    text.includes("bill") ||
    text.includes("recharge") ||
    text.includes("netflix")
  ) {
    return "Bills";
  }

  if (
    text.includes("salary") ||
    text.includes("bonus") ||
    text.includes("freelance") ||
    text.includes("credit")
  ) {
    return "Salary";
  }

  return "Other";
}

function detectType(description = "", type = "") {
  const text = description.toLowerCase();

  if (type.toLowerCase() === "income") return "Income";
  if (type.toLowerCase() === "expense") return "Expense";

  if (
    text.includes("salary") ||
    text.includes("bonus") ||
    text.includes("freelance") ||
    text.includes("credit")
  ) {
    return "Income";
  }

  return "Expense";
}

function normalizeText(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function checkDuplicate(tableName, userId, transaction) {
  return new Promise((resolve, reject) => {
    const title = normalizeText(transaction.description);
    const date = transaction.date || new Date().toISOString().split("T")[0];
    const amount = Math.abs(Number(transaction.amount || 0));

    const query = `
      SELECT id
      FROM ${tableName}
      WHERE user_id = ?
      AND LOWER(TRIM(title)) = ?
      AND date = ?
      AND amount = ?
      LIMIT 1
    `;

    db.get(query, [userId, title, date, amount], (error, row) => {
      if (error) reject(error);
      else resolve(Boolean(row));
    });
  });
}

async function insertIncome(userId, transaction) {
  const isDuplicate = await checkDuplicate("income", userId, transaction);

  if (isDuplicate) {
    return false;
  }

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO income
      (
        user_id,
        title,
        category,
        member,
        amount,
        note,
        date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        transaction.description || "Statement Income",
        detectCategory(transaction.description),
        "Self",
        Math.abs(Number(transaction.amount || 0)),
        "Imported from statement",
        transaction.date || new Date().toISOString().split("T")[0]
      ],
      (error) => {
        if (error) reject(error);
        else resolve(true);
      }
    );
  });
}

async function insertExpense(userId, transaction) {
  const isDuplicate = await checkDuplicate("expenses", userId, transaction);

  if (isDuplicate) {
    return false;
  }

  return new Promise((resolve, reject) => {
    db.run(
      `
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
      `,
      [
        userId,
        transaction.description || "Statement Expense",
        detectCategory(transaction.description),
        "Self",
        Math.abs(Number(transaction.amount || 0)),
        "Statement",
        "Imported from statement",
        transaction.date || new Date().toISOString().split("T")[0]
      ],
      (error) => {
        if (error) reject(error);
        else resolve(true);
      }
    );
  });
}

function parseCsv(content) {
  const rows = content
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  const dataRows = rows.slice(1);

  return dataRows
    .map((row) => {
      const columns = row.split(",");

      return {
        date: columns[0]?.trim(),
        description: columns[1]?.trim(),
        amount: Number(columns[2]),
        type: columns[3]?.trim()
      };
    })
    .filter((item) => item.description && !Number.isNaN(Number(item.amount)));
}

function parsePdfText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const amountMatches = line.match(/-?\d+(?:,\d{3})*(?:\.\d+)?/g);

      if (!amountMatches) return null;

      const rawAmount = amountMatches[amountMatches.length - 1].replace(
        /,/g,
        ""
      );

      const amount = Number(rawAmount);

      if (Number.isNaN(amount)) return null;

      return {
        date: new Date().toISOString().split("T")[0],
        description: line,
        amount,
        type: detectType(line)
      };
    })
    .filter(Boolean);
}

export async function uploadStatement(req, res) {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({
      message: "Statement file is required"
    });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname.toLowerCase();

  try {
    let transactions = [];

    if (fileName.endsWith(".csv")) {
      const content = fs.readFileSync(filePath, "utf8");
      transactions = parseCsv(content);
    } else if (fileName.endsWith(".pdf")) {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      transactions = parsePdfText(pdfData.text || "");
    } else {
      return res.status(400).json({
        message: "Only CSV and PDF files are supported for now"
      });
    }

    let importedIncome = 0;
    let importedExpenses = 0;
    let skippedDuplicates = 0;

    for (const transaction of transactions) {
      const type = detectType(transaction.description, transaction.type);
      let inserted = false;

      if (type === "Income") {
        inserted = await insertIncome(userId, transaction);

        if (inserted) {
          importedIncome++;
        } else {
          skippedDuplicates++;
        }
      } else {
        inserted = await insertExpense(userId, transaction);

        if (inserted) {
          importedExpenses++;
        } else {
          skippedDuplicates++;
        }
      }
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({
      success: true,
      message: `Statement processed successfully. ${skippedDuplicates} duplicate transaction(s) skipped.`,
      totalTransactions: transactions.length,
      importedIncome,
      importedExpenses,
      skippedDuplicates,
      transactions
    });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(500).json({
      message: error.message || "Failed to process statement"
    });
  }
}