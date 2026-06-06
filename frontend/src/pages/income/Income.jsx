import { useEffect, useMemo, useState } from "react";
import { incomeCategories, calculateTotal } from "../../store/financeStore";
import {
  createIncome,
  fetchIncome,
  removeIncome
} from "../../services/financeApi";

function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "Salary",
    amount: "",
    member: "Gaus",
    note: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadIncome = async () => {
    try {
      setLoading(true);
      const data = await fetchIncome();

      const mappedData = data.map((item) => ({
        id: item.id,
        date: item.date,
        title: item.title,
        category: item.category,
        member: item.member,
        amount: Number(item.amount),
        note: item.note
      }));

      setIncomeList(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncome();
  }, []);

  const filteredIncome = useMemo(() => {
    return incomeList.filter((income) => {
      const matchesSearch =
        income.title.toLowerCase().includes(search.toLowerCase()) ||
        income.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || income.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [incomeList, search, categoryFilter]);

  const totalIncome = calculateTotal(incomeList);

  const topIncomeSource = useMemo(() => {
    const totals = {};

    incomeList.forEach((income) => {
      totals[income.category] =
        (totals[income.category] || 0) + income.amount;
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  }, [incomeList]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddIncome = async () => {
    if (!formData.title || !formData.amount) return;

    try {
      setError("");

      await createIncome({
        title: formData.title,
        category: formData.category,
        member: formData.member,
        amount: Number(formData.amount),
        note: formData.note,
        date: new Date().toISOString().split("T")[0]
      });

      setFormData({
        title: "",
        category: "Salary",
        amount: "",
        member: "Gaus",
        note: ""
      });

      await loadIncome();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await removeIncome(id);
      await loadIncome();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Income Intelligence Center</span>
          <h1>Income Management</h1>
          <p>
            Track salary, freelance, business and passive income streams in one
            place.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Income</p>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">Current tracked income</span>
        </div>

        <div className="summary-card">
          <p>Income Records</p>
          <h2>{incomeList.length}</h2>
          <span className="muted">Active sources</span>
        </div>

        <div className="summary-card">
          <p>Top Source</p>
          <h2>{topIncomeSource}</h2>
          <span className="up">Highest contribution</span>
        </div>

        <div className="summary-card">
          <p>Income Stability</p>
          <h2>92%</h2>
          <span className="up">Strong monthly stability</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Add New Income</h3>
              <p className="muted">Saved permanently in SQLite database.</p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Income Title
              <input
                name="title"
                placeholder="Example: Monthly salary"
                value={formData.title}
                onChange={handleChange}
              />
            </label>

            <label>
              Income Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {incomeCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              Amount
              <input
                name="amount"
                type="number"
                placeholder="Example: 120000"
                value={formData.amount}
                onChange={handleChange}
              />
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

            <label className="full-span">
              Notes
              <input
                name="note"
                placeholder="Optional note"
                value={formData.note}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-action" onClick={handleAddIncome}>
            + Add Income
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Income Insight</span>
          <h3>Income Health</h3>
          <p>
            Your income entries are now stored in the backend database. This
            will later power dashboard, reports and AI CFO analysis.
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
            <h3>Income History</h3>
            <p className="muted">
              Search, filter and manage income sources.
            </p>
          </div>

          <div className="toolbar-actions">
            <input
              placeholder="Search income..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All</option>
              {incomeCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading income records...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredIncome.map((income) => (
                <tr key={income.id}>
                  <td>{income.date}</td>
                  <td>{income.title}</td>
                  <td>
                    <span className="tag">{income.category}</span>
                  </td>
                  <td>{income.member}</td>
                  <td className="up">
                    ₹{income.amount.toLocaleString("en-IN")}
                  </td>
                  <td>{income.note}</td>
                  <td>
                    <button
                      className="ghost-danger"
                      onClick={() => handleDelete(income.id)}
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

export default Income;