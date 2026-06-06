import { useEffect, useMemo, useState } from "react";
import { expenseCategories, calculateTotal } from "../../store/financeStore";
import {
  createExpense,
  fetchExpenses,
  removeExpense
} from "../../services/financeApi";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "Food",
    amount: "",
    paymentMode: "UPI",
    member: "Gaus",
    note: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchExpenses();

      const mappedData = data.map((item) => ({
        id: item.id,
        date: item.date,
        title: item.title,
        category: item.category,
        member: item.member,
        amount: Number(item.amount),
        paymentMode: item.payment_mode,
        note: item.note
      }));

      setExpenses(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);

  const totalExpense = calculateTotal(expenses);

  const topCategory = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });

    return (
      Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    );
  }, [expenses]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddExpense = async () => {
    if (!formData.title || !formData.amount) return;

    try {
      setError("");

      await createExpense({
        title: formData.title,
        category: formData.category,
        member: formData.member,
        amount: Number(formData.amount),
        payment_mode: formData.paymentMode,
        note: formData.note,
        date: new Date().toISOString().split("T")[0]
      });

      setFormData({
        title: "",
        category: "Food",
        amount: "",
        paymentMode: "UPI",
        member: "Gaus",
        note: ""
      });

      await loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await removeExpense(id);
      await loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Expense Control Center</span>
          <h1>Expense Management</h1>
          <p>
            Track spending, detect patterns and prepare data for AI financial
            insights.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{totalExpense.toLocaleString("en-IN")}</h2>
          <span className="down">Tracked spending</span>
        </div>

        <div className="summary-card">
          <p>Transactions</p>
          <h2>{expenses.length}</h2>
          <span className="up">Active records</span>
        </div>

        <div className="summary-card">
          <p>Top Category</p>
          <h2>{topCategory}</h2>
          <span className="muted">Highest spend area</span>
        </div>

        <div className="summary-card">
          <p>AI Savings Scope</p>
          <h2>₹4,250</h2>
          <span className="up">Potential saving</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Add New Expense</h3>
              <p className="muted">Saved permanently in SQLite database.</p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Expense Title
              <input
                name="title"
                placeholder="Example: Swiggy dinner"
                value={formData.title}
                onChange={handleChange}
              />
            </label>

            <label>
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {expenseCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              Amount
              <input
                name="amount"
                type="number"
                placeholder="Example: 520"
                value={formData.amount}
                onChange={handleChange}
              />
            </label>

            <label>
              Payment Mode
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </label>

            <label>
              Member
              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
              >
                <option>Gaus</option>
                <option>Family Member 1</option>
                <option>Family Member 2</option>
              </select>
            </label>

            <label>
              Notes
              <input
                name="note"
                placeholder="Optional note"
                value={formData.note}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-action" onClick={handleAddExpense}>
            + Add Expense
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Insight</span>
          <h3>Spending Pattern</h3>
          <p>
            Your expense entries are now stored in the backend database. This
            data will later power reports, dashboard analytics and AI CFO
            recommendations.
          </p>

          <div className="insight-box">
            <p>Database Status</p>
            <h2>Connected</h2>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Expense History</h3>
            <p className="muted">Search, filter and manage your expenses.</p>
          </div>

          <div className="toolbar-actions">
            <input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All</option>
              {expenseCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading expense records...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.title}</td>
                  <td>
                    <span className="tag">{expense.category}</span>
                  </td>
                  <td>{expense.paymentMode}</td>
                  <td>{expense.member}</td>
                  <td className="down">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <button
                      className="ghost-danger"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Expenses;