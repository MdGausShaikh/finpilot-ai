import { useEffect, useState } from "react";
import { fetchFinancialReport } from "../../services/financeApi";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchFinancialReport();
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="module-page">
        <p className="muted">Loading financial report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-page">
        <div className="auth-error">{error}</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="module-page">
        <p className="muted">No report data available.</p>
      </div>
    );
  }

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Financial Intelligence Reports</span>
          <h1>Reports Center</h1>
          <p>
            Complete financial overview generated from income, expenses, goals,
            family finance and investments.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Income</p>
          <h2>₹{report.overview.totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">Income report</span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{report.overview.totalExpenses.toLocaleString("en-IN")}</h2>
          <span className="down">Expense report</span>
        </div>

        <div className="summary-card">
          <p>Total Savings</p>
          <h2>₹{report.overview.savings.toLocaleString("en-IN")}</h2>
          <span className="up">{report.overview.savingsRate}% savings rate</span>
        </div>

        <div className="summary-card">
          <p>Health Score</p>
          <h2>{report.overview.financialHealthScore}/100</h2>
          <span className="up">Financial health</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Goals Report</h3>
              <p className="muted">Progress of all financial goals.</p>
            </div>
          </div>

          <div className="mini-stats">
            <div>
              <p>Target</p>
              <b>₹{report.goals.totalGoalTarget.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Saved</p>
              <b>₹{report.goals.totalGoalSaved.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Progress</p>
              <b>{report.goals.goalProgress}%</b>
            </div>

            <div>
              <p>Status</p>
              <b>Tracking</b>
            </div>
          </div>

          <div className="progress-line report-progress">
            <span style={{ width: `${report.goals.goalProgress}%` }}></span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Investment Report</h3>
              <p className="muted">Portfolio value and investment growth.</p>
            </div>
          </div>

          <div className="mini-stats">
            <div>
              <p>Invested</p>
              <b>₹{report.investments.totalInvested.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Current Value</p>
              <b>
                ₹
                {report.investments.currentInvestmentValue.toLocaleString(
                  "en-IN"
                )}
              </b>
            </div>

            <div>
              <p>Profit</p>
              <b>₹{report.investments.investmentProfit.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Monthly SIP</p>
              <b>₹{report.investments.monthlySip.toLocaleString("en-IN")}</b>
            </div>
          </div>
        </div>
      </section>

      <section className="module-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Family Finance Report</h3>
              <p className="muted">Combined family income and expense summary.</p>
            </div>
          </div>

          <div className="mini-stats">
            <div>
              <p>Family Income</p>
              <b>₹{report.family.familyIncome.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Family Expenses</p>
              <b>₹{report.family.familyExpenses.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Family Savings</p>
              <b>₹{report.family.familySavings.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <p>Capacity</p>
              <b>Strong</b>
            </div>
          </div>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Report Summary</span>
          <h3>{report.aiSummary.title}</h3>

          <p>{report.aiSummary.message}</p>

          <div className="insight-box">
            <p>Report Status</p>
            <h2>Generated</h2>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Report Actions</h3>
            <p className="muted">
              Export options will be connected in the next phase.
            </p>
          </div>

          <div className="toolbar-actions">
            <button>Download PDF</button>
            <button>Export CSV</button>
          </div>
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>Report Type</th>
              <th>Status</th>
              <th>Source Data</th>
              <th>AI Ready</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Income Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Income Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Expense Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Expense Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Goals Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Goals Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Investment Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Investment Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Family Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Family Database</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Reports;