import { useEffect, useMemo, useState } from "react";
import {
  createGoal,
  fetchGoals,
  removeGoal
} from "../../services/financeApi";

const goalTypes = [
  "Emergency Fund",
  "Car Purchase",
  "House Purchase",
  "Marriage",
  "Retirement",
  "Foreign Trip",
  "Child Education",
  "Custom Goal"
];

function getMonthsLeft(targetDate) {
  const today = new Date();
  const target = new Date(targetDate);

  if (!targetDate) return 1;

  const years = target.getFullYear() - today.getFullYear();
  const months = target.getMonth() - today.getMonth();

  return Math.max(years * 12 + months, 1);
}

function Goals() {
  const [goals, setGoals] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "Emergency Fund",
    targetAmount: "",
    currentAmount: "",
    monthlyContribution: "",
    targetDate: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchGoals();

      const mappedGoals = data.map((goal) => ({
        id: goal.id,
        name: goal.name,
        type: goal.type,
        targetAmount: Number(goal.target_amount || 0),
        currentAmount: Number(goal.current_amount || 0),
        monthlyContribution: Number(goal.monthly_contribution || 0),
        targetDate: goal.target_date
      }));

      setGoals(mappedGoals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const totalTarget = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0),
    [goals]
  );

  const totalSaved = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.currentAmount || 0), 0),
    [goals]
  );

  const completedGoals = goals.filter(
    (goal) => goal.currentAmount >= goal.targetAmount
  ).length;

  const onTrackGoals = goals.filter((goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsLeft = getMonthsLeft(goal.targetDate);
    const requiredMonthly = remaining / monthsLeft;

    return goal.monthlyContribution >= requiredMonthly;
  }).length;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addGoal = async () => {
    if (
      !formData.name ||
      !formData.targetAmount ||
      !formData.currentAmount ||
      !formData.monthlyContribution ||
      !formData.targetDate
    ) {
      return;
    }

    try {
      setError("");

      await createGoal({
        name: formData.name,
        type: formData.type,
        target_amount: Number(formData.targetAmount),
        current_amount: Number(formData.currentAmount),
        monthly_contribution: Number(formData.monthlyContribution),
        target_date: formData.targetDate
      });

      setFormData({
        name: "",
        type: "Emergency Fund",
        targetAmount: "",
        currentAmount: "",
        monthlyContribution: "",
        targetDate: ""
      });

      await loadGoals();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteGoal = async (id) => {
    try {
      setError("");
      await removeGoal(id);
      await loadGoals();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">AI Goal Planning System</span>
          <h1>Goals Planner</h1>
          <p>
            Plan emergency funds, cars, house, retirement, education and other
            long-term financial goals.
          </p>
        </div>

        <div className="hero-pill">Database Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Total Goal Target</p>
          <h2>₹{totalTarget.toLocaleString("en-IN")}</h2>
          <span className="muted">Combined goal value</span>
        </div>

        <div className="summary-card">
          <p>Total Saved</p>
          <h2>₹{totalSaved.toLocaleString("en-IN")}</h2>
          <span className="up">Current progress</span>
        </div>

        <div className="summary-card">
          <p>On Track Goals</p>
          <h2>{onTrackGoals}</h2>
          <span className="up">Goals in safe zone</span>
        </div>

        <div className="summary-card">
          <p>Completed Goals</p>
          <h2>{completedGoals}</h2>
          <span className="muted">Completed targets</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Create New Goal</h3>
              <p className="muted">
                Saved permanently in SQLite database.
              </p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Goal Name
              <input
                name="name"
                placeholder="Example: Buy a car"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Goal Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {goalTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label>
              Target Amount
              <input
                name="targetAmount"
                type="number"
                placeholder="Example: 1200000"
                value={formData.targetAmount}
                onChange={handleChange}
              />
            </label>

            <label>
              Current Savings
              <input
                name="currentAmount"
                type="number"
                placeholder="Example: 200000"
                value={formData.currentAmount}
                onChange={handleChange}
              />
            </label>

            <label>
              Monthly Contribution
              <input
                name="monthlyContribution"
                type="number"
                placeholder="Example: 25000"
                value={formData.monthlyContribution}
                onChange={handleChange}
              />
            </label>

            <label>
              Target Date
              <input
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-action" onClick={addGoal}>
            + Add Goal
          </button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">AI Goal Insight</span>
          <h3>Goal Health Summary</h3>

          <p>
            Your goals are now stored in the backend database. Later, AI CFO
            will use this data for future planning, affordability checks and
            investment suggestions.
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
            <h3>Goal Progress</h3>
            <p className="muted">
              Track target amount, savings, monthly contribution and goal
              health.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading goals...</p>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Type</th>
                <th>Target</th>
                <th>Saved</th>
                <th>Progress</th>
                <th>Required / Month</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {goals.map((goal) => {
                const progress = goal.targetAmount
                  ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                  : 0;

                const remaining = goal.targetAmount - goal.currentAmount;
                const monthsLeft = getMonthsLeft(goal.targetDate);
                const requiredMonthly = remaining / monthsLeft;
                const isOnTrack = goal.monthlyContribution >= requiredMonthly;

                return (
                  <tr key={goal.id}>
                    <td>{goal.name}</td>

                    <td>
                      <span className="tag">{goal.type}</span>
                    </td>

                    <td>₹{goal.targetAmount.toLocaleString("en-IN")}</td>

                    <td className="up">
                      ₹{goal.currentAmount.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <div className="progress-line">
                        <span style={{ width: `${progress}%` }}></span>
                      </div>
                      <small>{progress.toFixed(1)}%</small>
                    </td>

                    <td>
                      ₹
                      {Math.max(requiredMonthly, 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 0
                      })}
                    </td>

                    <td>
                      <span
                        className={
                          isOnTrack ? "tag success-tag" : "tag danger-tag"
                        }
                      >
                        {isOnTrack ? "On Track" : "At Risk"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="ghost-danger"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Goals;