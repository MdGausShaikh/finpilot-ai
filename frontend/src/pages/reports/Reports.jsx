import { useEffect, useState } from "react";
import {
  fetchExpenseReports,
  fetchFinancialReport
} from "../../services/financeApi";

function Reports() {
  const [report, setReport] = useState(null);
  const [expenseReport, setExpenseReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const [financialData, expenseData] = await Promise.all([
        fetchFinancialReport(),
        fetchExpenseReports()
      ]);

      setReport(financialData);
      setExpenseReport(expenseData);
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
        <p className="muted">Loading financial reports...</p>
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

  if (!report || !expenseReport) {
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
            Complete financial overview with daily expenses, monthly expenses,
            category analytics, goals, family finance and investments.
          </p>
        </div>

        <div className="hero-pill">Daily / Monthly Reports</div>
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
          <p>This Month Expense</p>
          <h2>
            ₹
            {Number(
              expenseReport.overview.currentMonthExpense || 0
            ).toLocaleString("en-IN")}
          </h2>
          <span className="down">Current month spending</span>
        </div>

        <div className="summary-card">
          <p>Expense Transactions</p>
          <h2>{expenseReport.overview.totalTransactions}</h2>
          <span className="muted">Total expense records</span>
        </div>
      </section>

      <section className="summary-grid four">
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

        <div className="summary-card">
          <p>Top Expense</p>
          <h2>
            ₹
            {Number(
              expenseReport.overview.topExpense?.amount || 0
            ).toLocaleString("en-IN")}
          </h2>
          <span className="down">
            {expenseReport.overview.topExpense?.title || "No expense found"}
          </span>
        </div>

        <div className="summary-card">
          <p>Top Category</p>
          <h2>
            {expenseReport.categoryReport?.[0]?.category || "N/A"}
          </h2>
          <span className="muted">
            ₹
            {Number(
              expenseReport.categoryReport?.[0]?.totalExpense || 0
            ).toLocaleString("en-IN")}
          </span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Daily Expense Report</h3>
              <p className="muted">
                Date-wise expense summary generated from live expense records.
              </p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Expense</th>
                <th>Transactions</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {expenseReport.dailyReport.length === 0 ? (
                <tr>
                  <td colSpan="4">No daily expense data available.</td>
                </tr>
              ) : (
                expenseReport.dailyReport.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td className="down">
                      ₹{Number(item.totalExpense || 0).toLocaleString("en-IN")}
                    </td>
                    <td>{item.transactionCount}</td>
                    <td>
                      <span className="tag success-tag">Generated</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Monthly Expense Report</h3>
              <p className="muted">
                Month-wise spending summary for long-term expense tracking.
              </p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Expense</th>
                <th>Transactions</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {expenseReport.monthlyReport.length === 0 ? (
                <tr>
                  <td colSpan="4">No monthly expense data available.</td>
                </tr>
              ) : (
                expenseReport.monthlyReport.map((item) => (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td className="down">
                      ₹{Number(item.totalExpense || 0).toLocaleString("en-IN")}
                    </td>
                    <td>{item.transactionCount}</td>
                    <td>
                      <span className="tag success-tag">Generated</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card table-card">
        <div className="card-header">
          <div>
            <h3>Category Expense Report</h3>
            <p className="muted">
              Category-wise expense breakdown for budget planning.
            </p>
          </div>
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Expense</th>
              <th>Transactions</th>
              <th>Budget Signal</th>
            </tr>
          </thead>

          <tbody>
            {expenseReport.categoryReport.length === 0 ? (
              <tr>
                <td colSpan="4">No category report data available.</td>
              </tr>
            ) : (
              expenseReport.categoryReport.map((item) => (
                <tr key={item.category}>
                  <td>{item.category || "Other"}</td>
                  <td className="down">
                    ₹{Number(item.totalExpense || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{item.transactionCount}</td>
                  <td>
                    <span className="tag">
                      {Number(item.totalExpense || 0) > 10000
                        ? "Review"
                        : "Normal"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
              <b>
                ₹
                {report.investments.investmentProfit.toLocaleString("en-IN")}
              </b>
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
          <span className="eyebrow">AI Expense Insight</span>
          <h3>Spending Intelligence</h3>

          <p>
            {expenseReport.aiInsight ||
              "Your expense report helps identify daily spending patterns and monthly expense trends."}
          </p>

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
              PDF and CSV export can be added in the next upgrade.
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
              <td>Daily Expense Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Expense Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Monthly Expense Report</td>
              <td>
                <span className="tag success-tag">Generated</span>
              </td>
              <td>Expense Database</td>
              <td>Yes</td>
            </tr>

            <tr>
              <td>Category Expense Report</td>
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