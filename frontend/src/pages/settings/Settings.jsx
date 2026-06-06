import { useState } from "react";
import { getCurrentUser } from "../../services/authService";

function Settings() {
  const user = getCurrentUser();

  const [profile, setProfile] = useState({
    name: user?.name || "Gaus",
    email: user?.email || "gaus@test.com",
    currency: "INR",
    theme: "Dark",
    notifications: "Enabled"
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Account Control Center</span>
          <h1>Settings</h1>
          <p>
            Manage profile, currency, theme, notifications and backup options.
          </p>
        </div>

        <div className="hero-pill">Profile Ready</div>
      </div>

      <section className="summary-grid four">
        <div className="summary-card">
          <p>Account</p>
          <h2>{profile.name}</h2>
          <span className="up">Active user</span>
        </div>

        <div className="summary-card">
          <p>Currency</p>
          <h2>{profile.currency}</h2>
          <span className="muted">Default currency</span>
        </div>

        <div className="summary-card">
          <p>Theme</p>
          <h2>{profile.theme}</h2>
          <span className="up">Current mode</span>
        </div>

        <div className="summary-card">
          <p>Notifications</p>
          <h2>{profile.notifications}</h2>
          <span className="muted">Reminder status</span>
        </div>
      </section>

      <section className="module-grid">
        <div className="card form-card">
          <div className="card-header">
            <div>
              <h3>Profile Settings</h3>
              <p className="muted">Update your personal finance workspace.</p>
            </div>
          </div>

          <div className="premium-form-grid">
            <label>
              Full Name
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Currency
              <select
                name="currency"
                value={profile.currency}
                onChange={handleChange}
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>AED</option>
              </select>
            </label>

            <label>
              Theme
              <select name="theme" value={profile.theme} onChange={handleChange}>
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </label>

            <label>
              Notifications
              <select
                name="notifications"
                value={profile.notifications}
                onChange={handleChange}
              >
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>

            <label>
              Security
              <input value="JWT Protected Account" readOnly />
            </label>
          </div>

          <button className="primary-action">Save Settings</button>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">Workspace Health</span>
          <h3>FinPilot Status</h3>

          <p>
            Your account is protected with JWT authentication. Database backup,
            profile update API and password change can be added in the next
            advanced upgrade.
          </p>

          <div className="insight-box">
            <p>Security Status</p>
            <h2>Protected</h2>
          </div>
        </div>
      </section>

      <section className="module-grid">
        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Data & Backup</h3>
              <p className="muted">Manage your local financial database.</p>
            </div>
          </div>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>SQLite Database</td>
                <td>
                  <span className="tag success-tag">Connected</span>
                </td>
                <td>Active</td>
              </tr>

              <tr>
                <td>Authentication</td>
                <td>
                  <span className="tag success-tag">Enabled</span>
                </td>
                <td>JWT</td>
              </tr>

              <tr>
                <td>Backup</td>
                <td>
                  <span className="tag">Manual Ready</span>
                </td>
                <td>Coming Soon</td>
              </tr>

              <tr>
                <td>Password Change</td>
                <td>
                  <span className="tag">API Pending</span>
                </td>
                <td>Future Upgrade</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">About Project</span>
          <h3>FinPilot AI</h3>

          <p>
            FinPilot AI is a personal finance copilot with income tracking,
            expenses, family finance, goals, investments, reports, net worth,
            statement intelligence and AI CFO guidance.
          </p>

          <div className="insight-box">
            <p>Project Version</p>
            <h2>v1.0 MVP</h2>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;