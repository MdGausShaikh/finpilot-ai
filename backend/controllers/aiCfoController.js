import { db } from "../config/database.js";

function getAdvice({
  totalIncome,
  totalExpenses,
  savings,
  savingsRate,
  investmentValue,
  monthlySip,
  goalProgress,
  familySavings
}) {
  const advice = [];

  if (totalIncome === 0) {
    advice.push("Add your income records first so FinPilot AI can analyze your financial position.");
  }

  if (savingsRate < 20) {
    advice.push("Your savings rate is below 20%. Try reducing flexible expenses like food, shopping and entertainment.");
  } else {
    advice.push("Your savings rate is healthy. Continue maintaining this discipline.");
  }

  if (monthlySip === 0) {
    advice.push("You are not tracking any SIP yet. Consider starting a small monthly investment after maintaining an emergency fund.");
  } else {
    advice.push(`Your monthly SIP of ₹${monthlySip.toLocaleString("en-IN")} is a strong wealth-building habit.`);
  }

  if (goalProgress < 30) {
    advice.push("Your financial goals are still in the early stage. Increase monthly contributions where possible.");
  } else {
    advice.push("Your goal progress looks positive. Keep tracking target dates and contribution amounts.");
  }

  if (familySavings > 0) {
    advice.push("Your family savings capacity is positive. You can allocate part of it toward emergency fund and long-term investments.");
  }

  if (investmentValue > 0) {
    advice.push("Your investment portfolio is active. Review diversification across equity, gold, debt and emergency cash.");
  }

  return advice;
}

export function getAiCfoAnalysis(req, res) {
  const userId = req.user.id;

  const queries = {
    income: `
      SELECT COALESCE(SUM(amount), 0) AS totalIncome
      FROM income
      WHERE user_id = ?
    `,
    expenses: `
      SELECT COALESCE(SUM(amount), 0) AS totalExpenses
      FROM expenses
      WHERE user_id = ?
    `,
    investments: `
      SELECT 
        COALESCE(SUM(current_value), 0) AS investmentValue,
        COALESCE(SUM(monthly_sip), 0) AS monthlySip
      FROM investments
      WHERE user_id = ?
    `,
    goals: `
      SELECT 
        COALESCE(SUM(target_amount), 0) AS totalGoalTarget,
        COALESCE(SUM(current_amount), 0) AS totalGoalSaved
      FROM goals
      WHERE user_id = ?
    `,
    family: `
      SELECT 
        COALESCE(SUM(income_contribution), 0) AS familyIncome,
        COALESCE(SUM(expense_share), 0) AS familyExpenses
      FROM family_members
      WHERE user_id = ?
    `
  };

  db.get(queries.income, [userId], (incomeError, incomeRow) => {
    if (incomeError) {
      return res.status(500).json({ message: incomeError.message });
    }

    db.get(queries.expenses, [userId], (expenseError, expenseRow) => {
      if (expenseError) {
        return res.status(500).json({ message: expenseError.message });
      }

      db.get(queries.investments, [userId], (investmentError, investmentRow) => {
        if (investmentError) {
          return res.status(500).json({ message: investmentError.message });
        }

        db.get(queries.goals, [userId], (goalError, goalRow) => {
          if (goalError) {
            return res.status(500).json({ message: goalError.message });
          }

          db.get(queries.family, [userId], (familyError, familyRow) => {
            if (familyError) {
              return res.status(500).json({ message: familyError.message });
            }

            const totalIncome = Number(incomeRow.totalIncome || 0);
            const totalExpenses = Number(expenseRow.totalExpenses || 0);
            const savings = totalIncome - totalExpenses;
            const savingsRate =
              totalIncome > 0 ? Number(((savings / totalIncome) * 100).toFixed(1)) : 0;

            const investmentValue = Number(investmentRow.investmentValue || 0);
            const monthlySip = Number(investmentRow.monthlySip || 0);

            const totalGoalTarget = Number(goalRow.totalGoalTarget || 0);
            const totalGoalSaved = Number(goalRow.totalGoalSaved || 0);
            const goalProgress =
              totalGoalTarget > 0
                ? Number(((totalGoalSaved / totalGoalTarget) * 100).toFixed(1))
                : 0;

            const familyIncome = Number(familyRow.familyIncome || 0);
            const familyExpenses = Number(familyRow.familyExpenses || 0);
            const familySavings = familyIncome - familyExpenses;

            const financialHealthScore = Math.max(
              0,
              Math.min(100, Math.round(savingsRate + 50))
            );

            const riskLevel =
              financialHealthScore >= 80
                ? "Low"
                : financialHealthScore >= 60
                ? "Moderate"
                : "High";

            const safeEmiLimit = Math.round(totalIncome * 0.25);
            const safeInvestmentCapacity = Math.max(
              0,
              Math.round(savings * 0.4)
            );

            const advice = getAdvice({
              totalIncome,
              totalExpenses,
              savings,
              savingsRate,
              investmentValue,
              monthlySip,
              goalProgress,
              familySavings
            });

            return res.json({
              summary: {
                totalIncome,
                totalExpenses,
                savings,
                savingsRate,
                investmentValue,
                monthlySip,
                goalProgress,
                familyIncome,
                familyExpenses,
                familySavings,
                financialHealthScore,
                riskLevel,
                safeEmiLimit,
                safeInvestmentCapacity
              },
              recommendations: advice,
              cfoMessage:
                "This AI CFO report is generated from your real FinPilot data. Claude AI integration can be added later for deeper natural-language financial advisory.",
              scenarioExamples: [
                {
                  question: "Can I buy a car?",
                  answer:
                    totalIncome > 0
                      ? `Your safe EMI limit is around ₹${safeEmiLimit.toLocaleString("en-IN")} per month. Keep car EMI below this limit.`
                      : "Add income records first to calculate car affordability."
                },
                {
                  question: "How much can I invest monthly?",
                  answer: `Based on current savings, a safe monthly investment capacity is around ₹${safeInvestmentCapacity.toLocaleString("en-IN")}.`
                },
                {
                  question: "Is my family budget healthy?",
                  answer:
                    familySavings >= 0
                      ? "Your family budget shows positive savings capacity."
                      : "Your family expenses are higher than income contribution. Review shared expenses."
                }
              ]
            });
          });
        });
      });
    });
  });
}