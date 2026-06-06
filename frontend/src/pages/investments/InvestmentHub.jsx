import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from "recharts";
import {
  createInvestment,
  fetchInvestments,
  removeInvestment
} from "../../services/financeApi";

const investmentTypes = [
  "Mutual Fund",
  "Stock",
  "Gold",
  "Silver",
  "Crypto",
  "FD",
  "PPF",
  "EPF",
  "NPS",
  "Bond",
  "Real Estate"
];

const growthData = [
  { year: "2026", value: 917000 },
  { year: "2028", value: 1450000 },
  { year: "2030", value: 2280000 },
  { year: "2032", value: 3480000 },
  { year: "2035", value: 6900000 },
  { year: "2040", value: 11200000 }
];

const COLORS = ["#7c3aed", "#14b8a6", "#f59e0b", "#60a5fa", "#fb7185", "#94a3b8"];

function InvestmentHub() {
  const [investments, setInvestments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "Mutual Fund",
    investedAmount: "",
    currentValue: "",
    monthlySip: "",
    expectedReturn: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchInvestments();

      const mappedInvestments = data.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        investedAmount: Number(item.invested_amount || 0),
        currentValue: Number(item.current_value || 0),
        monthlySip: Number(item.monthly_sip || 0),
        expectedReturn: Number(item.expected_return || 0)
      }));

      setInvestments(mappedInvestments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const totalInvested = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + Number(item.investedAmount || 0),
        0
      ),
    [investments]
  );

  const totalCurrentValue = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + Number(item.currentValue || 0),
        0
      ),
    [investments]
  );

  const totalSip = useMemo(
    () =>
      investments.reduce(
        (sum, item) => sum + Number(item.monthlySip || 0),
        0
      ),
    [investments]
  );

  const profit = totalCurrentValue - totalInvested;

  const returnPercent =
    totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : 0;

  const allocation = useMemo(() => {
    const totals = {};

    investments.forEach((item) => {
      totals[item.type] =
        (totals[item.type] || 0) + Number(item.currentValue || 0);
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value
    }));
  }, [investments]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addInvestment = async () => {
    if (!formData.name || !formData.investedAmount || !formData.currentValue) {
      return;
    }

    try {
      setError("");

      await createInvestment({
        name: formData.name,
        type: formData.type,
        invested_amount: Number(formData.investedAmount),
        current_value: Number(formData.currentValue),
        monthly_sip: Number(formData.monthlySip || 0),
        expected_return: Number(formData.expectedReturn || 0)
      });

      setFormData({
        name: "",
        type: "Mutual Fund",
        investedAmount: "",
        currentValue: "",
        monthlySip: "",
        expectedReturn: ""
      });

      await loadInvestments();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteInvestment = async (id) => {
    try {
      setError("");
      await removeInvestment(id);
      await loadInvestments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">AI Investment Intelligence</span>
          <h1>Investment Hub</h1>
          <p>
            Track mutual funds, stocks, gold, SIPs and portfolio growth from
            one command center.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Invested</p>
          <h2>₹{totalInvested.toLocaleString("en-IN")}</h2>
          <span className="muted">Principal amount</span>
        </div>

        <div className="summary-card">
          <p>Current Value</p>
          <h2>₹{totalCurrentValue.toLocaleString("en-IN")}</h2>
          <span className="up">Portfolio value</span>
        </div>

        <div className="summary-card">
          <p>Total Profit</p>
          <h2>₹{profit.toLocaleString("en-IN")}</h2>
          <span className={profit >= 0 ? "up" : "down"}>
            {returnPercent}% overall return
          </span>
        </div>

        <div className="summary-card">
          <p>Monthly SIP</p>
          <h2>₹{totalSip.toLocaleString("en-IN")}</h2>
          <span className="up">Recurring investment</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Add Investment</h3>
              <p className="muted">
                Saved permanently in SQLite database.
              </p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Investment Name
              <input
                name="name"
                placeholder="Example: Nifty Index Fund"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Investment Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {investmentTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label>
              Invested Amount
              <input
                name="investedAmount"
                type="number"
                placeholder="Example: 450000"
                value={formData.investedAmount}
                onChange={handleChange}
              />
            </label>

            <label>
              Current Value
              <input
                name="currentValue"
                type="number"
                placeholder="Example: 542000"
                value={formData.currentValue}
                onChange={handleChange}
              />
            </label>

            <label>
              Monthly SIP
              <input
                name="monthlySip"
                type="number"
                placeholder="Example: 15000"
                value={formData.monthlySip}
                onChange={handleChange}
              />
            </label>

            <label>
              Expected Return %
              <input
                name="expectedReturn"
                type="number"
                placeholder="Example: 12"
                value={formData.expectedReturn}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-action" onClick={addInvestment}>
            + Add Investment
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Portfolio Insight</span>
          <h3>Portfolio Health</h3>

          <p>
            Your investments are now connected to backend storage. This data
            will later power net worth, AI CFO, portfolio analysis and wealth
            forecasting.
          </p>

          <div className="insight-box">
            <p>Database Status</p>
            <h2>Connected</h2>
          </div>
        </div>
      </section>

      <section className="module-grid">
        <div className="card">
          <div className="card-header">
            <h3>Portfolio Growth Projection</h3>
            <button>AI Forecast</button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growthData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                fill="#7c3aed33"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Asset Allocation</h3>
            <button>Current</button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={allocation}
                dataKey="value"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {allocation.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="legend-list">
            {allocation.length === 0 ? (
              <p className="muted">No allocation data yet.</p>
            ) : (
              allocation.map((item, index) => (
                <div key={item.name}>
                  <span
                    className="dot"
                    style={{
                      background: COLORS[index % COLORS.length]
                    }}
                  ></span>
                  <p>{item.name}</p>
                  <b>₹{item.value.toLocaleString("en-IN")}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Investment Portfolio</h3>
            <p className="muted">
              Manage all investments, SIPs and returns.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading investments...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Invested</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>SIP</th>
                <th>Expected Return</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {investments.map((item) => {
                const gain = item.currentValue - item.investedAmount;

                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    <td>
                      <span className="tag">{item.type}</span>
                    </td>

                    <td>
                      ₹{item.investedAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="up">
                      ₹{item.currentValue.toLocaleString("en-IN")}
                    </td>

                    <td className={gain >= 0 ? "up" : "down"}>
                      ₹{gain.toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹{item.monthlySip.toLocaleString("en-IN")}
                    </td>

                    <td>{item.expectedReturn}%</td>

                    <td>
                      <button
                        className="ghost-danger"
                        onClick={() => deleteInvestment(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {investments.length === 0 && (
                <tr>
                  <td colSpan="8">No investments added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default InvestmentHub;