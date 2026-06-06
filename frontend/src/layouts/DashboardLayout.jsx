import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import AppRoutes from "../routes/AppRoutes";

function DashboardLayout() {
  const navigate = useNavigate();
  const [quickQuestion, setQuickQuestion] = useState("");

  const goToCopilot = (question) => {
    navigate("/copilot");

    if (question) {
      setTimeout(() => {
        localStorage.setItem("finpilot_quick_question", question);
      }, 100);
    }
  };

  const handleAsk = () => {
    if (!quickQuestion.trim()) {
      navigate("/copilot");
      return;
    }

    localStorage.setItem("finpilot_quick_question", quickQuestion);
    navigate("/copilot");
    setQuickQuestion("");
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />
        <AppRoutes />
      </main>

      <aside className="right-panel">
        <div className="card ai-card">
          <div className="card-header">
            <h3>✨ AI Copilot</h3>
            <span>BETA</span>
          </div>

          <h2>Hello Gaus 👋</h2>
          <p>I&apos;m your AI financial assistant. How can I help you today?</p>

          <div className="quick-prompts">
            <button onClick={() => goToCopilot("Analyze my monthly spending")}>
              Analyze my spending
            </button>

            <button onClick={() => goToCopilot("Create a monthly budget")}>
              Create budget
            </button>

            <button onClick={() => goToCopilot("Suggest investment allocation")}>
              Investment advice
            </button>

            <button onClick={() => goToCopilot("Check my financial health")}>
              Financial health
            </button>
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask anything..."
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAsk();
              }}
            />

            <button onClick={handleAsk}>➤</button>
          </div>
        </div>

        <div className="card statement-card">
          <div className="card-header">
            <h3>Statement Intelligence</h3>
            <span>NEW</span>
          </div>

          <div className="upload-box">
            <p>Upload PDF / Excel / CSV Statement</p>

            <button onClick={() => navigate("/statements")}>
              Upload Statement
            </button>
          </div>

          <div className="upload-info">
            <p>
              AI will automatically extract transactions, categorize spending
              and generate reports.
            </p>
          </div>
        </div>

        <div className="card recommendation-card">
          <h3>AI Recommendation</h3>
          <p>
            Based on your live financial data, review spending, budget and
            investment opportunities from the AI Copilot.
          </p>

          <ul>
            <li>
              Budget Planner <b onClick={() => navigate("/budget")}>Open</b>
            </li>
            <li>
              Reports Center <b onClick={() => navigate("/reports")}>Open</b>
            </li>
            <li>
              Investments <b onClick={() => navigate("/investments")}>Open</b>
            </li>
          </ul>

          <button onClick={() => navigate("/copilot")}>View Analysis</button>
        </div>
      </aside>

      <button className="voice-btn" onClick={() => navigate("/copilot")}>
        🎤
      </button>
    </div>
  );
}

export default DashboardLayout;