import { useEffect, useMemo, useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import { icons } from "../../data/dashboardData";
import {
  fetchDashboardSummary,
  fetchExpenses,
  fetchFamilyMembers,
  fetchInvestments
} from "../../services/financeApi";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const COLORS = [
  "#7c3aed",
  "#14b8a6",
  "#fb7185",
  "#f59e0b",
  "#60a5fa",
  "#94a3b8"
];

function Dashboard() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    financialHealthScore: 0,
    recentTransactions: []
  });

  const [expenses, setExpenses] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, expenseData, familyData, investmentData] =
        await Promise.all([
          fetchDashboardSummary(),
          fetchExpenses(),
          fetchFamilyMembers(),
          fetchInvestments()
        ]);

      setSummary(dashboardData);
      setExpenses(expenseData || []);
      setFamilyMembers(familyData || []);
      setInvestments(investmentData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const healthLabel = useMemo(() => {
    if (summary.financialHealthScore >= 80) return "Excellent";
    if (summary.financialHealthScore >= 60) return "Good";
    if (summary.financialHealthScore >= 40) return "Average";
    return "Needs Focus";
  }, [summary.financialHealthScore]);

  const dashboardTransactions = summary.recentTransactions || [];

  const expenseOverview = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const cashFlowData = useMemo(() => {
    const transactions = [...dashboardTransactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let income = 0;
    let expense = 0;

    return transactions.map((item, index) => {
      if (item.type === "Income") {
        income += Number(item.amount || 0);
      } else {
        expense += Number(item.amount || 0);
      }

      return {
        label: item.date || `Txn ${index + 1}`,
        income,
        expense
      };
    });
  }, [dashboardTransactions]);

  const totalFamilyIncome = useMemo(
    () =>
      familyMembers.reduce(
        (sum, member) => sum + Number(member.income_contribution || 0),
        0
      ),
    [familyMembers]
  );

  const totalFamilyExpenses = useMemo(
    () =>
      familyMembers.reduce(
        (sum, member) => sum + Number(member.expense_share || 0),
        0
      ),
    [familyMembers]
  );

  const totalFamilySavings = totalFamilyIncome - totalFamilyExpenses;

  const totalInvestmentValue = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + Number(item.current_value || 0),
        0
      ),
    [investments]
  );

  const totalInvestedAmount = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + Number(item.invested_amount || 0),
        0
      ),
    [investments]
  );

  const investmentProfit = totalInvestmentValue - totalInvestedAmount;

  const estimatedTenYearValue = useMemo(() => {
    const monthlyInvestment = 5000;
    const annualReturn = 0.12;
    const months = 120;
    const monthlyRate = annualReturn / 12;

    const futureValue =
      monthlyInvestment *
      (((1 + monthlyRate) ** months - 1) / monthlyRate) *
      (1 + monthlyRate);

    return Math.round(futureValue);
  }, []);

  const savingsRate =
    summary.totalIncome > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((summary.savings / summary.totalIncome) * 100))
        )
      : 0;

  return (
    <>
      <section className="hero">
        <div>
          <h1>Good Morning, Gaus 👋</h1>
          <p>
            Here&apos;s what&apos;s happening with your real financial data
            today.
          </p>
        </div>
      </section>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="muted">Loading dashboard data...</p>}

      <section className="metrics">
        <MetricCard
          title="Total Balance"
          value={`₹${Number(summary.totalBalance || 0).toLocaleString(
            "en-IN"
          )}`}
          note="Calculated from income - expenses"
          icon={icons.Wallet}
        />

        <MetricCard
          title="Total Income"
          value={`₹${Number(summary.totalIncome || 0).toLocaleString("en-IN")}`}
          note="From database records"
          icon={icons.Users}
        />

        <MetricCard
          title="Total Expenses"
          value={`₹${Number(summary.totalExpenses || 0).toLocaleString(
            "en-IN"
          )}`}
          note="From database records"
          icon={icons.CreditCard}
          danger
        />

        <MetricCard
          title="Total Savings"
          value={`₹${Number(summary.savings || 0).toLocaleString("en-IN")}`}
          note="Income minus expenses"
          icon={icons.Target}
        />

        <div className="card health-card">
          <p>Financial Health Score</p>

          <div className="health-content">
            <h2>
              {summary.financialHealthScore}
              <span>/100</span>
            </h2>

            <div className="ring">{summary.financialHealthScore}</div>
          </div>

          <strong>{healthLabel}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card expense-card">
          <div className="card-header">
            <h3>Expenses Overview</h3>
            <button>Live Data</button>
          </div>

          {expenseOverview.length === 0 ? (
            <p className="muted">No expense data available.</p>
          ) : (
            <div className="expense-body">
              <ResponsiveContainer width="45%" height={230}>
                <PieChart>
                  <Pie
                    data={expenseOverview}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {expenseOverview.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="legend-list">
                {expenseOverview.map((item, index) => (
                  <div key={item.name}>
                    <span
                      className="dot"
                      style={{
                        background: COLORS[index % COLORS.length]
                      }}
                    ></span>

                    <p>{item.name}</p>

                    <b>₹{Number(item.value || 0).toLocaleString("en-IN")}</b>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card cash-card">
          <div className="card-header">
            <h3>Cash Flow Trend</h3>
            <button>Live Trend</button>
          </div>

          {cashFlowData.length === 0 ? (
            <p className="muted">No transaction trend available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={cashFlowData}>
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#7c3aed"
                  fill="#7c3aed33"
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#14b8a6"
                  fill="#14b8a633"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card budget-card">
          <h3>Budget Overview</h3>

          <div className="large-ring">{savingsRate}%</div>

          <h2>₹{Number(summary.savings || 0).toLocaleString("en-IN")}</h2>

          <p>Available savings</p>

          <button>View Budget</button>
        </div>

        <div className="card family-card">
          <div className="card-header">
            <h3>Family Finance Overview</h3>
            <button>Live Family</button>
          </div>

          <div className="mini-stats">
            <div>
              <p>Income</p>
              <b>₹{Number(totalFamilyIncome || 0).toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Expenses</p>
              <b>
                ₹{Number(totalFamilyExpenses || 0).toLocaleString("en-IN")}
              </b>
            </div>

            <div>
              <p>Savings</p>
              <b>
                ₹{Number(totalFamilySavings || 0).toLocaleString("en-IN")}
              </b>
            </div>

            <div>
              <p>Members</p>
              <b>{familyMembers.length}</b>
            </div>
          </div>
        </div>

        <div className="card investment-card">
          <div className="card-header">
            <h3>Investments</h3>
            <button>Live Portfolio</button>
          </div>

          <h2>₹{Number(totalInvestmentValue || 0).toLocaleString("en-IN")}</h2>

          <span className={investmentProfit >= 0 ? "up" : "down"}>
            ₹{Number(investmentProfit || 0).toLocaleString("en-IN")} profit/loss
          </span>
        </div>

        <div className="card networth-card">
          <div className="card-header">
            <h3>Net Worth Summary</h3>
            <button>Live Net Worth</button>
          </div>

          <h2>
            ₹
            {Number(
              Number(summary.totalBalance || 0) + Number(totalInvestmentValue || 0)
            ).toLocaleString("en-IN")}
          </h2>

          <span className="up">Cash balance + investments</span>
        </div>

        <div className="card transactions-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button>Live Data</button>
          </div>

          <table>
            <tbody>
              {dashboardTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4">No transactions found.</td>
                </tr>
              ) : (
                dashboardTransactions.map((item) => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td>{item.date}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>

                    <td className={item.type === "Income" ? "up" : "down"}>
                      {item.type === "Income" ? "+" : "-"}₹
                      {Number(item.amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card report-card">
          <h3>AI Monthly Report</h3>

          <div className="trophy">🏆</div>

          <h2>{healthLabel} Month</h2>

          <p>
            Your current savings are ₹
            {Number(summary.savings || 0).toLocaleString("en-IN")} and your
            savings rate is {savingsRate}%.
          </p>
        </div>

        <div className="card simulator-card">
          <h3>AI Scenario Lab</h3>

          <p>If you invest ₹5,000/month</p>

          <h2>₹{estimatedTenYearValue.toLocaleString("en-IN")}</h2>

          <span>Estimated value after 10 years at 12% return</span>
        </div>
      </section>
    </>
  );
}

export default Dashboard;