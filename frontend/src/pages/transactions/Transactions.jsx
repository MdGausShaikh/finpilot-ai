import { useEffect, useMemo, useState } from "react";
import { fetchIncome, fetchExpenses } from "../../services/financeApi";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const [incomeData, expenseData] = await Promise.all([
        fetchIncome(),
        fetchExpenses()
      ]);

      const incomeTransactions = incomeData.map((item) => ({
        id: `income-${item.id}`,
        date: item.date,
        title: item.title,
        category: item.category,
        member: item.member,
        amount: Number(item.amount),
        type: "Income",
        source: "Income"
      }));

      const expenseTransactions = expenseData.map((item) => ({
        id: `expense-${item.id}`,
        date: item.date,
        title: item.title,
        category: item.category,
        member: item.member,
        amount: Number(item.amount),
        type: "Expense",
        source: "Expense"
      }));

      const merged = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.member.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const totalIncome = transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Unified Money Timeline</span>
          <h1>Transactions</h1>
          <p>
            View all income and expenses together in one clean transaction
            timeline.
          </p>
        </div>

        <div className="hero-pill">Live Database Data</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Income</p>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">Income records</span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
          <span className="down">Expense records</span>
        </div>

        <div className="summary-card">
          <p>Net Flow</p>
          <h2>₹{netFlow.toLocaleString("en-IN")}</h2>
          <span className={netFlow >= 0 ? "up" : "down"}>
            Income minus expenses
          </span>
        </div>

        <div className="summary-card">
          <p>Total Transactions</p>
          <h2>{transactions.length}</h2>
          <span className="muted">Combined records</span>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Transaction History</h3>
            <p className="muted">
              Search and filter all financial activity.
            </p>
          </div>

          <div className="toolbar-actions">
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading transactions...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Member</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.title}</td>
                  <td>
                    <span
                      className={
                        item.type === "Income"
                          ? "tag success-tag"
                          : "tag danger-tag"
                      }
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.member}</td>
                  <td className={item.type === "Income" ? "up" : "down"}>
                    {item.type === "Income" ? "+" : "-"}₹
                    {item.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Transactions;