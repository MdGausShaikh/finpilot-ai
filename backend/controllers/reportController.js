import { db } from "../config/database.js";

export function getFinancialReport(req, res) {
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
    `,
    investments: `
      SELECT 
        COALESCE(SUM(invested_amount), 0) AS totalInvested,
        COALESCE(SUM(current_value), 0) AS currentInvestmentValue,
        COALESCE(SUM(monthly_sip), 0) AS monthlySip
      FROM investments
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

      db.get(queries.goals, [userId], (goalError, goalRow) => {
        if (goalError) {
          return res.status(500).json({ message: goalError.message });
        }

        db.get(queries.family, [userId], (familyError, familyRow) => {
          if (familyError) {
            return res.status(500).json({ message: familyError.message });
          }

          db.get(
            queries.investments,
            [userId],
            (investmentError, investmentRow) => {
              if (investmentError) {
                return res.status(500).json({
                  message: investmentError.message
                });
              }

              const totalIncome = Number(incomeRow.totalIncome || 0);
              const totalExpenses = Number(expenseRow.totalExpenses || 0);
              const savings = totalIncome - totalExpenses;
              const savingsRate =
                totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

              const totalInvested = Number(investmentRow.totalInvested || 0);
              const currentInvestmentValue = Number(
                investmentRow.currentInvestmentValue || 0
              );
              const investmentProfit =
                currentInvestmentValue - totalInvested;

              const totalGoalTarget = Number(goalRow.totalGoalTarget || 0);
              const totalGoalSaved = Number(goalRow.totalGoalSaved || 0);
              const goalProgress =
                totalGoalTarget > 0
                  ? ((totalGoalSaved / totalGoalTarget) * 100).toFixed(1)
                  : 0;

              const familyIncome = Number(familyRow.familyIncome || 0);
              const familyExpenses = Number(familyRow.familyExpenses || 0);
              const familySavings = familyIncome - familyExpenses;

              const financialHealthScore = Math.max(
                0,
                Math.min(
                  100,
                  Math.round(Number(savingsRate) + 50)
                )
              );

              return res.json({
                overview: {
                  totalIncome,
                  totalExpenses,
                  savings,
                  savingsRate,
                  financialHealthScore
                },
                goals: {
                  totalGoalTarget,
                  totalGoalSaved,
                  goalProgress
                },
                family: {
                  familyIncome,
                  familyExpenses,
                  familySavings
                },
                investments: {
                  totalInvested,
                  currentInvestmentValue,
                  investmentProfit,
                  monthlySip: Number(investmentRow.monthlySip || 0)
                },
                aiSummary: {
                  title: "AI Financial Report",
                  message:
                    "Your financial report has been generated using income, expenses, goals, family and investment data. Claude AI integration will later convert this into a detailed personalized advisory report."
                }
              });
            }
          );
        });
      });
    });
  });
}