import { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { uploadStatement } from "../../services/financeApi";

function StatementUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalIncome = transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpenses = transactions
    .filter((item) => item.type !== "Income")
    .reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsAnalyzed(false);
    setTransactions([]);
    setUploadResult(null);
    setUploadMessage("");
    setError("");
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a statement file first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUploadMessage("");

      const data = await uploadStatement(selectedFile);

      setUploadResult(data);
      setTransactions(data.transactions || []);
      setUploadMessage(data.message || "Statement processed successfully");
      setIsAnalyzed(true);
    } catch (err) {
      setError(err.message || "Statement upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Statement Intelligence Center</span>
          <h1>Bank Statement Analyzer</h1>
          <p>
            Upload CSV, Excel or PDF statements and FinPilot will import income
            and expenses into your database automatically.
          </p>
        </div>

        <div className="hero-pill">CSV / Excel / PDF Ready</div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {uploadMessage && <div className="auth-success">{uploadMessage}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Files Supported</p>
          <h2>CSV / Excel / PDF</h2>
          <span className="up">Database import ready</span>
        </div>

        <div className="summary-card">
          <p>Imported Income</p>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">
            {uploadResult?.importedIncome || 0} income entries
          </span>
        </div>

        <div className="summary-card">
          <p>Imported Expenses</p>
          <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
          <span className="down">
            {uploadResult?.importedExpenses || 0} expense entries
          </span>
        </div>

        <div className="summary-card">
          <p>Transactions Found</p>
          <h2>
            {uploadResult?.totalTransactions || transactions.length || 0}
          </h2>
          <span className="muted">Parsed records</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Upload Monthly Statement</h3>
              <p className="muted">
                Upload bank or credit card statement in CSV, Excel or PDF
                format.
              </p>
            </div>
          </div>

          <div className="statement-dropzone">
            <Upload size={42} />
            <h3>Drop your statement here</h3>
            <p>Supported formats: CSV, XLSX, XLS, PDF</p>

            <label className="file-picker">
              Choose File
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="selected-file">
                <FileText size={18} />
                <span>{selectedFile.name}</span>
              </div>
            )}

            <button
              className="primary-action"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Processing..." : "Analyze & Import"}
            </button>
          </div>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Statement Insight</span>
          <h3>Auto Import System</h3>

          <p>
            FinPilot reads your statement, detects income or expense, assigns a
            statement category, and saves the result into your Income or Expense
            database.
          </p>

          <div className="insight-box">
            <p>Estimated Manual Work Saved</p>
            <h2>85%</h2>
          </div>
        </div>
      </section>

      {isAnalyzed && (
        <>
          <section className="card table-card">
            <div className="table-toolbar">
              <div>
                <h3>Extracted Transactions</h3>
                <p className="muted">
                  These transactions were parsed from your uploaded statement.
                </p>
              </div>
            </div>

            <table className="premium-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date || "-"}</td>
                    <td>{item.description || "Statement Transaction"}</td>
                    <td>
                      <span
                        className={
                          item.type === "Income"
                            ? "tag success-tag"
                            : "tag danger-tag"
                        }
                      >
                        {item.type || "Expense"}
                      </span>
                    </td>
                    <td className={item.type === "Income" ? "up" : "down"}>
                      ₹
                      {Math.abs(Number(item.amount || 0)).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      Statement imported successfully. Detailed preview is not
                      available for this file type.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section className="module-grid">
            <div className="card ai-insight-card">
              <span className="eyebrow">
                <Sparkles size={14} /> AI Report
              </span>
              <h3>Statement Import Complete</h3>
              <p>
                Imported transactions are now available in your Income,
                Expenses, Dashboard, Transactions and Reports modules.
              </p>
            </div>

            <div className="card ai-insight-card">
              <span className="eyebrow">
                <ShieldCheck size={14} /> Safety Check
              </span>
              <h3>Fraud & Duplicate Detection</h3>
              <p>
                Basic import is active. Duplicate detection and advanced fraud
                checks can be added in the next upgrade.
              </p>

              <div className="insight-box">
                <p>
                  <AlertTriangle size={14} /> Review Required
                </p>
                <h2>Manual Review</h2>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default StatementUpload;