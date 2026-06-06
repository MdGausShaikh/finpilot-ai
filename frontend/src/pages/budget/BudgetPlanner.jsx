import { useEffect, useMemo, useState } from "react";
import { fetchIncome, fetchExpenses } from "../../services/financeApi";

const defaultBudgets = [
  { category: "Food", limit: 10000 },
  { category: "Shopping", limit: 8000 },
  { category: "Travel", limit: 6000 },
  { category: "Bills", limit: 12000 },
  { category: "Health", limit: 5000 },
  { category: "Entertainment", limit: 4000 }
];

function BudgetPlanner() {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [formData, setFormData] = useState({
    category: "",
    limit: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [incomeData, expenseData] = await Promise.all([
        fetchIncome(),
        fetchExpenses()
      ]);

      setIncomeList(incomeData);
      setExpenseList(expenseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalIncome = useMemo(
    () => incomeList.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [incomeList]
  );

  const totalExpenses = useMemo(
    () => expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenseList]
  );

  const savings = totalIncome - totalExpenses;

  const categorySpend = useMemo(() => {
    const totals = {};

    expenseList.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + Number(expense.amount || 0);
    });

    return totals;
  }, [expenseList]);

  const totalBudgetLimit = budgets.reduce(
    (sum, item) => sum + Number(item.limit || 0),
    0
  );

  const addBudget = () => {
    if (!formData.category || !formData.limit) return;

    setBudgets([
      {
        category: formData.category,
        limit: Number(formData.limit)
      },
      ...budgets
    ]);

    setFormData({
      category: "",
      limit: ""
    });
  };

  const deleteBudget = (category) => {
    setBudgets(budgets.filter((item) => item.category !== category));
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Smart Budget Control</span>
          <h1>Budget Planner</h1>
          <p>
            Plan monthly budgets, compare actual spending and identify overspend
            areas using your live expense data.
          </p>
        </div>

        <div className="hero-pill">Live Expense Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="muted">Loading budget data...</p>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Income</p>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">Available income</span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
          <span className="down">Actual spending</span>
        </div>

        <div className="summary-card">
          <p>Budget Limit</p>
          <h2>₹{totalBudgetLimit.toLocaleString("en-IN")}</h2>
          <span className="muted">Planned budget</span>
        </div>

        <div className="summary-card">
          <p>Available Savings</p>
          <h2>₹{savings.toLocaleString("en-IN")}</h2>
          <span className={savings >= 0 ? "up" : "down"}>Income - expenses</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Add Budget Category</h3>
              <p className="muted">
                Add or adjust monthly budget limits.
              </p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Category
              <input
                placeholder="Example: Food"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </label>

            <label>
              Monthly Limit
              <input
                type="number"
                placeholder="Example: 10000"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
              />
            </label>
          </div>

          <button className="primary-action" onClick={addBudget}>
            + Add Budget
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Budget Insight</span>
          <h3>Budget Health</h3>

          <p>
            FinPilot compares your planned category budget with actual spending
            from the Expenses module and highlights overspending risks.
          </p>

          <div className="insight-box">
            <p>Budget Status</p>
            <h2>{totalExpenses <= totalBudgetLimit ? "On Track" : "Over Budget"}</h2>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Budget vs Actual</h3>
            <p className="muted">
              Category-wise planned budget against real spending.
            </p>
          </div>
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget Limit</th>
              <th>Actual Spend</th>
              <th>Remaining</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {budgets.map((budget) => {
              const spent = Number(categorySpend[budget.category] || 0);
              const remaining = Number(budget.limit || 0) - spent;
              const usage =
                budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
              const isOver = spent > budget.limit;

              return (
                <tr key={budget.category}>
                  <td>{budget.category}</td>
                  <td>₹{Number(budget.limit).toLocaleString("en-IN")}</td>
                  <td className="down">₹{spent.toLocaleString("en-IN")}</td>
                  <td className={remaining >= 0 ? "up" : "down"}>
                    ₹{remaining.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <div className="progress-line">
                      <span style={{ width: `${usage}%` }}></span>
                    </div>
                    <small>{usage.toFixed(1)}%</small>
                  </td>
                  <td>
                    <span className={isOver ? "tag danger-tag" : "tag success-tag"}>
                      {isOver ? "Over Budget" : "On Track"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ghost-danger"
                      onClick={() => deleteBudget(budget.category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default BudgetPlanner;