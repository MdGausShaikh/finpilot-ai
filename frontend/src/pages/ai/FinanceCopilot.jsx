import { useEffect, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Home,
  Car,
  GraduationCap
} from "lucide-react";
import { fetchAiCfoAnalysis } from "../../services/financeApi";

const smartQuestions = [
  "Analyze my monthly spending",
  "Can I invest ₹10,000 per month?",
  "How can my family save more?",
  "Create a monthly budget",
  "Check my financial health",
  "Suggest investment allocation"
];

const scenarioCards = [
  {
    title: "Can I buy a car?",
    icon: Car,
    question: "Can I buy a ₹12 lakh car with my current income and savings?"
  },
  {
    title: "Can I buy a house?",
    icon: Home,
    question: "Can I afford a home loan next year?"
  },
  {
    title: "Education Planning",
    icon: GraduationCap,
    question: "How much should I save for child education?"
  },
  {
    title: "Investment Capacity",
    icon: TrendingUp,
    question: "How much can I safely invest every month?"
  }
];

function FinanceCopilot() {
  const [analysis, setAnalysis] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hello 👋 I am your AI Finance Copilot. I will analyze your real FinPilot data and help with budgeting, savings, goals, family finance and investments."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAiCfoAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  useEffect(() => {
  if (!analysis) return;

  const savedQuestion = localStorage.getItem(
    "finpilot_quick_question"
  );

  if (savedQuestion) {
    localStorage.removeItem("finpilot_quick_question");

    setTimeout(() => {
      sendMessage(savedQuestion);
    }, 300);
  }
}, [analysis]);

  const generateCfoReply = (question) => {
    if (!analysis) {
      return "I am still loading your financial data. Please try again in a moment.";
    }

    const q = question.toLowerCase();
    const summary = analysis.summary;

    if (q.includes("spending") || q.includes("expense")) {
      return `Spending Analysis

• Total Expenses: ₹${summary.totalExpenses.toLocaleString("en-IN")}
• Total Income: ₹${summary.totalIncome.toLocaleString("en-IN")}
• Savings Rate: ${summary.savingsRate}%

Recommendation:
Your spending is under control. Keep expenses below 60% of income and review food, shopping and entertainment categories monthly.`;
    }

    if (q.includes("invest")) {
      return `Investment Capacity Analysis

• Safe Investment Capacity: ₹${summary.safeInvestmentCapacity.toLocaleString(
        "en-IN"
      )}
• Current Monthly SIP: ₹${summary.monthlySip.toLocaleString("en-IN")}
• Risk Level: ${summary.riskLevel}

Recommendation:
You can safely invest around ₹${summary.safeInvestmentCapacity.toLocaleString(
        "en-IN"
      )} per month, but keep emergency funds protected first.`;
    }

    if (q.includes("car") || q.includes("emi")) {
      return `Car / EMI Affordability Check

• Safe EMI Limit: ₹${summary.safeEmiLimit.toLocaleString("en-IN")}
• Monthly Income: ₹${summary.totalIncome.toLocaleString("en-IN")}
• Financial Health Score: ${summary.financialHealthScore}/100

Recommendation:
Keep any car EMI below ₹${summary.safeEmiLimit.toLocaleString(
        "en-IN"
      )} per month. Avoid high down-payment if it reduces your emergency fund.`;
    }

    if (q.includes("family")) {
      return `Family Finance Analysis

• Family Income: ₹${summary.familyIncome.toLocaleString("en-IN")}
• Family Expenses: ₹${summary.familyExpenses.toLocaleString("en-IN")}
• Family Savings: ₹${summary.familySavings.toLocaleString("en-IN")}

Recommendation:
Your family savings position is ${
        summary.familySavings >= 0 ? "positive" : "negative"
      }. Focus on shared budget planning and emergency fund allocation.`;
    }

    if (q.includes("goal")) {
      return `Goal Planning Analysis

• Goal Progress: ${summary.goalProgress}%
• Savings: ₹${summary.savings.toLocaleString("en-IN")}
• Safe Investment Capacity: ₹${summary.safeInvestmentCapacity.toLocaleString(
        "en-IN"
      )}

Recommendation:
Your goals are currently at ${summary.goalProgress}% progress. Increase monthly goal contribution if the target date is near.`;
    }

    if (q.includes("health")) {
      return `Financial Health Check

• Score: ${summary.financialHealthScore}/100
• Risk Level: ${summary.riskLevel}
• Savings Rate: ${summary.savingsRate}%

Recommendation:
Your financial health is ${
        summary.riskLevel === "Low" ? "strong" : "improvable"
      }. Maintain savings discipline and avoid unnecessary liabilities.`;
    }

    if (q.includes("budget")) {
      return `Budget Planning Analysis

• Total Income: ₹${summary.totalIncome.toLocaleString("en-IN")}
• Total Expenses: ₹${summary.totalExpenses.toLocaleString("en-IN")}
• Savings: ₹${summary.savings.toLocaleString("en-IN")}
• Savings Rate: ${summary.savingsRate}%

Recommendation:
Use a simple monthly rule: essential expenses first, emergency fund second, investments third. Keep flexible spending controlled.`;
    }

    return `AI CFO Overview

• Total Income: ₹${summary.totalIncome.toLocaleString("en-IN")}
• Total Expenses: ₹${summary.totalExpenses.toLocaleString("en-IN")}
• Savings: ₹${summary.savings.toLocaleString("en-IN")}
• Savings Rate: ${summary.savingsRate}%
• Financial Health Score: ${summary.financialHealthScore}/100
• Risk Level: ${summary.riskLevel}

Recommendation:
${analysis.recommendations.map((item) => `• ${item}`).join("\n")}`;
  };

  const sendMessage = (customQuestion) => {
    const question = customQuestion || input;

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    const aiMessage = {
      role: "ai",
      text: generateCfoReply(question)
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  const summary = analysis?.summary;

  return (
    <div className="module-page">
      <div className="module-hero">
        <div>
          <span className="eyebrow">Real Data AI CFO</span>
          <h1>AI Finance Copilot</h1>
          <p>
            Ask financial questions and get AI CFO-style guidance using your
            actual income, expenses, goals, family and investment data.
          </p>
        </div>

        <div className="hero-pill">Backend Connected</div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p className="muted">Loading AI CFO analysis...</p>}

      <section className="summary-grid four">
        <div className="summary-card">
          <p>AI Mode</p>
          <h2>CFO</h2>
          <span className="up">Financial advisor mode</span>
        </div>

        <div className="summary-card">
          <p>Financial Health</p>
          <h2>{summary?.financialHealthScore || 0}/100</h2>
          <span className="up">Real data score</span>
        </div>

        <div className="summary-card">
          <p>Risk Level</p>
          <h2>{summary?.riskLevel || "N/A"}</h2>
          <span className="muted">Based on savings rate</span>
        </div>

        <div className="summary-card">
          <p>Monthly Capacity</p>
          <h2>
            ₹
            {Number(summary?.safeInvestmentCapacity || 0).toLocaleString(
              "en-IN"
            )}
          </h2>
          <span className="up">Safe investment scope</span>
        </div>
      </section>

      <section className="copilot-layout">
        <div className="card copilot-chat-card">
          <div className="card-header">
            <div>
              <h3>
                <Bot size={18} /> AI Finance Chat
              </h3>
              <p className="muted">
                Ask anything about your money, goals or investments.
              </p>
            </div>

            <span className="tag success-tag">Online</span>
          </div>

          <div className="chat-window">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "ai"
                    ? "chat-message ai-message"
                    : "chat-message user-message"
                }
              >
                <div className="chat-avatar">
                  {msg.role === "ai" ? <Sparkles size={15} /> : "G"}
                </div>

                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="copilot-input">
            <input
              placeholder="Ask: Can I buy a car? Can I invest more?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={() => sendMessage()}>
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="copilot-side">
          <div className="card ai-insight-card">
            <span className="eyebrow">Quick Questions</span>
            <h3>Ask FinPilot AI</h3>

            <div className="quick-question-list">
              {smartQuestions.map((question) => (
                <button key={question} onClick={() => sendMessage(question)}>
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="card ai-insight-card">
            <span className="eyebrow">AI CFO Summary</span>
            <h3>Current Recommendation</h3>

            <p>{analysis?.cfoMessage || "AI CFO summary loading..."}</p>

            <div className="insight-box">
              <p>Safe EMI Limit</p>
              <h2>
                ₹{Number(summary?.safeEmiLimit || 0).toLocaleString("en-IN")}
                /month
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Scenario Lab</h3>
            <p className="muted">
              Test major financial decisions before taking action.
            </p>
          </div>
        </div>

        <div className="scenario-grid">
          {scenarioCards.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className="scenario-card"
                onClick={() => sendMessage(item.question)}
              >
                <div className="icon-bubble">
                  <Icon size={22} />
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.question}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="module-grid">
        <div className="card ai-insight-card">
          <span className="eyebrow">
            <ShieldCheck size={14} /> AI Recommendations
          </span>

          <h3>Personal CFO Advice</h3>

          <ul>
            {(analysis?.recommendations || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card ai-insight-card">
          <span className="eyebrow">
            <Wallet size={14} /> Wealth Direction
          </span>

          <h3>Financial Direction</h3>

          <p>
            Current savings rate is {summary?.savingsRate || 0}%. Your safe
            investment capacity is ₹
            {Number(summary?.safeInvestmentCapacity || 0).toLocaleString(
              "en-IN"
            )}
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default FinanceCopilot;