import { ChevronRight, LogOut, Moon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../../data/dashboardData";
import { getCurrentUser, logoutUser } from "../../services/authService";

const routeMap = {
  Dashboard: "/",
  Transactions: "/transactions",
  Income: "/income",
  Expenses: "/expenses",
  "Budget Planner": "/budget",
  "Family Finance": "/family",
  Investments: "/investments",
  "Market Intelligence": "/market",
  Goals: "/goals",
  "Net Worth": "/networth",
  "AI Copilot": "/copilot",
  Reports: "/reports",
  Statements: "/statements",
  Settings: "/settings"
};

function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-mark">F</div>

        <div>
          <h1>FinPilot AI</h1>
          <p>AI Financial OS</p>
        </div>
      </div>

      <nav>
        {navItems.map(([label, Icon]) => (
          <NavLink
            key={label}
            to={routeMap[label]}
            className={({ isActive }) =>
              isActive ? "active nav-btn" : "nav-btn"
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="profile-card">
        <div className="avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
        </div>

        <div>
          <h4>{user?.name || "Gaus Siddique"}</h4>
          <p>{user?.email || "Premium Plan"}</p>
        </div>

        <ChevronRight size={18} />
      </div>

      <div className="theme-toggle">
        <Moon size={18} />
        <span>Dark Mode</span>
        <div className="switch"></div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;