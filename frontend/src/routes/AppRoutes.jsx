import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Expenses from "../pages/expenses/Expenses";
import Income from "../pages/income/Income";
import FamilyDashboard from "../pages/family/FamilyDashboard";
import StatementUpload from "../pages/statements/StatementUpload";
import Goals from "../pages/goals/Goals";
import InvestmentHub from "../pages/investments/InvestmentHub";
import MarketInsights from "../pages/investments/MarketInsights";
import FinanceCopilot from "../pages/ai/FinanceCopilot";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Reports from "../pages/reports/Reports";
import NetWorth from "../pages/networth/NetWorth";
import Transactions from "../pages/transactions/Transactions";
import BudgetPlanner from "../pages/budget/BudgetPlanner";
import Settings from "../pages/settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/income" element={<Income />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/budget" element={<BudgetPlanner />} />
      <Route path="/family" element={<FamilyDashboard />} />
      <Route path="/investments" element={<InvestmentHub />} />
      <Route path="/market" element={<MarketInsights />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/networth" element={<NetWorth />} />
      <Route path="/copilot" element={<FinanceCopilot />} />
      <Route path="/statements" element={<StatementUpload />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default AppRoutes;