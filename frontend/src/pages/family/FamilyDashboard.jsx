import { useEffect, useMemo, useState } from "react";
import {
  createFamilyMember,
  fetchFamilyMembers,
  removeFamilyMember
} from "../../services/financeApi";

function FamilyDashboard() {
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    role: "Member",
    incomeContribution: "",
    expenseShare: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchFamilyMembers();

      const mappedMembers = data.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        incomeContribution: Number(member.income_contribution || 0),
        expenseShare: Number(member.expense_share || 0)
      }));

      setMembers(mappedMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const totalIncome = useMemo(
    () => members.reduce((sum, member) => sum + member.incomeContribution, 0),
    [members]
  );

  const totalExpenses = useMemo(
    () => members.reduce((sum, member) => sum + member.expenseShare, 0),
    [members]
  );

  const totalSavings = totalIncome - totalExpenses;

  const dependencyRatio =
    totalIncome > 0 ? (totalExpenses / totalIncome).toFixed(2) : "0.00";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = async () => {
    if (!formData.name) return;

    try {
      setError("");

      await createFamilyMember({
        name: formData.name,
        role: formData.role,
        income_contribution: Number(formData.incomeContribution || 0),
        expense_share: Number(formData.expenseShare || 0)
      });

      setFormData({
        name: "",
        role: "Member",
        incomeContribution: "",
        expenseShare: ""
      });

      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      setError("");
      await removeFamilyMember(id);
      await loadMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Family Finance Intelligence</span>
          <h1>Family Finance Dashboard</h1>
          <p>
            Manage combined income, member contributions, shared expenses and
            family savings goals.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Family Income</p>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
          <span className="up">Combined monthly income</span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
          <span className="down">Shared family expense</span>
        </div>

        <div className="summary-card">
          <p>Family Savings</p>
          <h2>₹{totalSavings.toLocaleString("en-IN")}</h2>
          <span className="up">Available saving capacity</span>
        </div>

        <div className="summary-card">
          <p>Dependency Ratio</p>
          <h2>{dependencyRatio}</h2>
          <span className="muted">Expense / income ratio</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Add Family Member</h3>
              <p className="muted">Saved permanently in SQLite database.</p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Member Name
              <input
                name="name"
                placeholder="Example: Father / Mother / Brother"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Role
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Dependent</option>
                <option>Child</option>
              </select>
            </label>

            <label>
              Income Contribution
              <input
                name="incomeContribution"
                type="number"
                placeholder="Example: 60000"
                value={formData.incomeContribution}
                onChange={handleChange}
              />
            </label>

            <label>
              Expense Share
              <input
                name="expenseShare"
                type="number"
                placeholder="Example: 25000"
                value={formData.expenseShare}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-action" onClick={handleAddMember}>
            + Add Member
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Family Insight</span>
          <h3>Family Budget Health</h3>

          <p>
            Your family records are now connected to the backend database.
            FinPilot can use this data for savings capacity, dependency ratio
            and family investment planning.
          </p>

          <div className="insight-box">
            <p>Suggested Monthly Investment</p>
            <h2>
              ₹
              {Math.max(totalSavings * 0.3, 0).toLocaleString("en-IN", {
                maximumFractionDigits: 0
              })}
            </h2>
          </div>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-toolbar">
          <div>
            <h3>Family Members</h3>
            <p className="muted">
              Member-wise income contribution and expense share.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading family members...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Income Contribution</th>
                <th>Expense Share</th>
                <th>Savings Capacity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>

                  <td>
                    <span className="tag">{member.role}</span>
                  </td>

                  <td className="up">
                    ₹{member.incomeContribution.toLocaleString("en-IN")}
                  </td>

                  <td className="down">
                    ₹{member.expenseShare.toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹
                    {(
                      member.incomeContribution - member.expenseShare
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <button
                      className="ghost-danger"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td colSpan="6">No family members added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default FamilyDashboard;