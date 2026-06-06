import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer
} from "recharts";
import { fetchNetWorthSummary } from "../../services/financeApi";

const COLORS = [
  "#7c3aed",
  "#14b8a6",
  "#f59e0b",
  "#60a5fa",
  "#fb7185",
  "#94a3b8"
];

function NetWorth() {
  const [summary, setSummary] = useState({
    cashBalance: 0,
    investmentValue: 0,
    investedAmount: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    debtRatio: 0,
    allocation: [],
    trend: [],
    aiInsight: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNetWorth = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNetWorthSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetWorth();
  }, []);

  const investmentProfit = useMemo(() => {
    return Number(summary.investmentValue || 0) - Number(summary.investedAmount || 0);
  }, [summary]);

  const wealthStatus = useMemo(() => {
    if (summary.netWorth >= 1000000) return "Strong";
    if (summary.netWorth >= 300000) return "Growing";
    if (summary.netWorth > 0) return "Building";
    return "Needs Focus";
  }, [summary.netWorth]);

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Automated Wealth Command Center</span>
          <h1>Net Worth Tracker</h1>
          <p>
            Automatically calculate your net worth using income, expenses and
            investment data from the FinPilot database.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="muted">Loading net worth summary...</p>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Cash Balance</p>
          <h2>₹{Number(summary.cashBalance || 0).toLocaleString("en-IN")}</h2>
          <span className="up">Income minus expenses</span>
        </div>

        <div className="summary-card">
          <p>Investment Value</p>
          <h2>₹{Number(summary.investmentValue || 0).toLocaleString("en-IN")}</h2>
          <span className="up">Current portfolio value</span>
        </div>

        <div className="summary-card">
          <p>Total Net Worth</p>
          <h2>₹{Number(summary.netWorth || 0).toLocaleString("en-IN")}</h2>
          <span className="up">{wealthStatus}</span>
        </div>

        <div className="summary-card">
          <p>Debt Ratio</p>
          <h2>{summary.debtRatio}%</h2>
          <span className="muted">Liabilities / assets</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Net Worth Trend</h3>
              <p className="muted">Automated trend based on current data.</p>
            </div>

            <button>Auto Forecast</button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={summary.trend || []}>
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="#7c3aed"
                fill="#7c3aed33"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Asset Allocation</h3>
              <p className="muted">Cash balance vs investments.</p>
            </div>

            <button>Live Data</button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={summary.allocation || []}
                dataKey="value"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {(summary.allocation || []).map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="legend-list">
            {(summary.allocation || []).length === 0 ? (
              <p className="muted">No allocation data yet.</p>
            ) : (
              (summary.allocation || []).map((item, index) => (
                <div key={item.name}>
                  <span
                    className="dot"
                    style={{ background: COLORS[index % COLORS.length] }}
                  ></span>

                  <p>{item.name}</p>

                  <b>₹{Number(item.value || 0).toLocaleString("en-IN")}</b>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="module-grid">
        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Assets Breakdown</h3>
              <p className="muted">
                Automatic asset calculation from connected modules.
              </p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Asset Type</th>
                <th>Source</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Cash Balance</td>
                <td>Income - Expenses</td>
                <td className="up">
                  ₹{Number(summary.cashBalance || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <span className="tag success-tag">Connected</span>
                </td>
              </tr>

              <tr>
                <td>Investment Portfolio</td>
                <td>Investment Hub</td>
                <td className="up">
                  ₹{Number(summary.investmentValue || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <span className="tag success-tag">Connected</span>
                </td>
              </tr>

              <tr>
                <td>Total Assets</td>
                <td>Auto Calculation</td>
                <td className="up">
                  ₹{Number(summary.totalAssets || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <span className="tag success-tag">Live</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Liabilities Breakdown</h3>
              <p className="muted">
                Loan and liability tracking can be expanded later.
              </p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Liability Type</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Loans / Debt</td>
                <td className="down">
                  ₹{Number(summary.totalLiabilities || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <span className="tag">Auto Ready</span>
                </td>
              </tr>

              <tr>
                <td>Debt Ratio</td>
                <td>{summary.debtRatio}%</td>
                <td>
                  <span className="tag success-tag">Healthy</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card ai-insight-card">
        <span className="eyebrow">AI Wealth Insight</span>
        <h3>Net Worth Health</h3>

        <p>
          {summary.aiInsight ||
            "Your automated net worth will improve as you add income, expenses and investments."}
        </p>

        <div className="insight-box">
          <p>Investment Profit</p>
          <h2>₹{investmentProfit.toLocaleString("en-IN")}</h2>
        </div>
      </section>
    </div>
  );
}

export default NetWorth;