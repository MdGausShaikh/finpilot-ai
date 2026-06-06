import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import statementRoutes from "./routes/statementRoutes.js";
import netWorthRoutes from "./routes/netWorthRoutes.js";
import aiCfoRoutes from "./routes/aiCfoRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

initDatabase();

app.get("/", (req, res) => {
  res.json({
    message: "FinPilot AI Backend is running successfully"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/networth", netWorthRoutes);
app.use("/api/ai-cfo", aiCfoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FinPilot AI backend running on http://127.0.0.1:${PORT}`);
});